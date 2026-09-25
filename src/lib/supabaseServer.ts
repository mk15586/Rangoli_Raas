import { createClient } from '@supabase/supabase-js';

type BookingRecord = {
  id: string;
  ticket_id: string;
  ticket_token: string;
  order_id: string;
  payment_id: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tier_id: string;
  tier_name: string;
  quantity: number;
  total_attendees: number;
  unit_price: number;
  total_paid: number;
  event_date: string;
  venue: string;
  gate_entry: string;
  issued_at: string;
  verify_url: string;
  email_delivery: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRecord;
        Insert: Omit<BookingRecord, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<BookingRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let supabaseServerClient: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Supabase is not configured on the server.');
  }

  if (!supabaseServerClient) {
    supabaseServerClient = createClient<Database>(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return supabaseServerClient;
}
