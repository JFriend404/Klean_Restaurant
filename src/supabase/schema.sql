-- ============================================================
-- FULL RESET (no storage bucket deletion)
-- ============================================================
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP POLICY IF EXISTS "Public can view food images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload food images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update food images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete food images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled');

-- ============================================================
-- TABLES
-- ============================================================
CREATE TABLE public.profiles (
  id            UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT NOT NULL,
  full_name     TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  address       TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  slug        TEXT NOT NULL UNIQUE,
  icon        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.foods (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  image_url     TEXT,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status            order_status NOT NULL DEFAULT 'pending',
  total_amount      NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  delivery_name     TEXT NOT NULL,
  delivery_phone    TEXT NOT NULL,
  delivery_address  TEXT NOT NULL,
  delivery_note     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  food_id     UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  food_name   TEXT NOT NULL,
  food_price  NUMERIC(10,2) NOT NULL,
  quantity    INT NOT NULL CHECK (quantity > 0),
  subtotal    NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- SEED: Categories
-- ============================================================
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Burgers',  'burgers',  '🍔'),
  ('Desserts', 'desserts', '🍰'),
  ('Drinks',   'drinks',   '☕');

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER foods_updated_at BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT USING (public.is_admin());

-- CATEGORIES
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL USING (public.is_admin());

-- FOODS
CREATE POLICY "Anyone can view available foods"
  ON public.foods FOR SELECT USING (is_available = TRUE);
CREATE POLICY "Admins can view all foods"
  ON public.foods FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can manage foods"
  ON public.foods FOR ALL USING (public.is_admin());

-- ORDERS
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE USING (public.is_admin());

-- ORDER ITEMS
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create order items"
  ON public.order_items FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT USING (public.is_admin());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view food images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'food-images');
CREATE POLICY "Admins can upload food images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'food-images' AND public.is_admin());
CREATE POLICY "Admins can update food images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'food-images' AND public.is_admin());
CREATE POLICY "Admins can delete food images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'food-images' AND public.is_admin());

CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::TEXT = (storage.foldername(name))[1]);
