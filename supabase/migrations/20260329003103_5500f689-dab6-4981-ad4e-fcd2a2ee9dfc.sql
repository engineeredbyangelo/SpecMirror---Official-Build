
-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Brief',
  brief TEXT DEFAULT '',
  spec TEXT DEFAULT '',
  confidence INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own projects" ON public.projects FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users insert own projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own projects" ON public.projects FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users delete own projects" ON public.projects FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Shared specs table
CREATE TABLE public.shared_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL,
  encrypted_spec TEXT NOT NULL,
  encryption_iv TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.shared_specs ENABLE ROW LEVEL SECURITY;

-- Creator can manage their shares
CREATE POLICY "Users manage own shares" ON public.shared_specs FOR ALL TO authenticated USING (shared_by = auth.uid()) WITH CHECK (shared_by = auth.uid());

-- Anyone can read by token (for public viewer)
CREATE POLICY "Public read by token" ON public.shared_specs FOR SELECT TO anon USING (true);
