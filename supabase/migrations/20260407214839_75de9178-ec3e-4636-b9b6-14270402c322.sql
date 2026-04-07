
CREATE TABLE public.generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own generation logs"
  ON public.generation_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users insert own generation logs"
  ON public.generation_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_generation_logs_user_date
  ON public.generation_logs (user_id, created_at);
