-- Drop existing restrictive policies for listings
DROP POLICY IF EXISTS "Admins can view all listings" ON public.listings;
DROP POLICY IF EXISTS "Anyone can view active listings" ON public.listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can update any listing" ON public.listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
DROP POLICY IF EXISTS "Admins can delete any listing" ON public.listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;

-- Drop existing restrictive policies for profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Drop existing restrictive policies for user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create PERMISSIVE policies for listings (SELECT)
CREATE POLICY "Anyone can view active listings"
ON public.listings FOR SELECT
USING (status = 'active');

CREATE POLICY "Users can view their own listings"
ON public.listings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all listings"
ON public.listings FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for listings (INSERT)
CREATE POLICY "Users can insert their own listings"
ON public.listings FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create PERMISSIVE policies for listings (UPDATE)
CREATE POLICY "Users can update their own listings"
ON public.listings FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any listing"
ON public.listings FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for listings (DELETE)
CREATE POLICY "Users can delete their own listings"
ON public.listings FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete any listing"
ON public.listings FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for profiles (SELECT)
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for profiles (INSERT)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create PERMISSIVE policies for profiles (UPDATE)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for user_roles (SELECT)
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create PERMISSIVE policies for user_roles (ALL - for insert, update, delete)
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));