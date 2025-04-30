-- Função para criar a tabela user_preferences se não existir
CREATE OR REPLACE FUNCTION public.create_user_preferences_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Verificar se a tabela existe no schema public
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_preferences'
  ) THEN
    -- Criar a tabela no schema public
    CREATE TABLE public.user_preferences (
      user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      temperature_unit VARCHAR(1) NOT NULL DEFAULT 'C',
      theme VARCHAR(10) NOT NULL DEFAULT 'light',
      notifications_enabled BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );

    -- Adicionar comentário à tabela
    COMMENT ON TABLE public.user_preferences IS 'Preferências dos usuários';
    
    -- Adicionar políticas RLS
    ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
    
    -- Política para permitir que usuários vejam apenas suas próprias preferências
    CREATE POLICY "Usuários podem ver suas próprias preferências" 
      ON public.user_preferences 
      FOR SELECT 
      USING (auth.uid() = user_id);
      
    -- Política para permitir que usuários atualizem apenas suas próprias preferências
    CREATE POLICY "Usuários podem atualizar suas próprias preferências" 
      ON public.user_preferences 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para criar a tabela user_locations se não existir
CREATE OR REPLACE FUNCTION public.create_user_locations_if_not_exists()
RETURNS void AS $$
BEGIN
  -- Verificar se a tabela existe no schema public
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'user_locations'
  ) THEN
    -- Criar a tabela no schema public
    CREATE TABLE public.user_locations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      city VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL DEFAULT 'Brasil',
      latitude NUMERIC NULL,
      longitude NUMERIC NULL,
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
    );

    -- Adicionar comentário à tabela
    COMMENT ON TABLE public.user_locations IS 'Localizações dos usuários';
    
    -- Adicionar políticas RLS
    ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;
    
    -- Política para permitir que usuários vejam apenas suas próprias localizações
    CREATE POLICY "Usuários podem ver suas próprias localizações" 
      ON public.user_locations 
      FOR SELECT 
      USING (auth.uid() = user_id);
      
    -- Política para permitir que usuários atualizem apenas suas próprias localizações
    CREATE POLICY "Usuários podem atualizar suas próprias localizações" 
      ON public.user_locations 
      FOR UPDATE 
      USING (auth.uid() = user_id);
      
    -- Política para permitir que usuários insiram suas próprias localizações
    CREATE POLICY "Usuários podem inserir suas próprias localizações" 
      ON public.user_locations 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
      
    -- Política para permitir que usuários excluam suas próprias localizações
    CREATE POLICY "Usuários podem excluir suas próprias localizações" 
      ON public.user_locations 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;
