-- Remove a tabela whatsapp_notifications que não será mais usada
DROP TABLE IF EXISTS public.whatsapp_notifications;

-- Remove a função trigger que criava notificações na tabela
DROP FUNCTION IF EXISTS public.notify_prestadores_whatsapp() CASCADE;