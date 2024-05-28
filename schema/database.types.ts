export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customer_orders: {
        Row: {
          created_at: string
          id: string
          phone_number: string
          receipt_id: string | null
          ticket_num_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone_number: string
          receipt_id?: string | null
          ticket_num_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          phone_number?: string
          receipt_id?: string | null
          ticket_num_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_ticket_num_id_fkey"
            columns: ["ticket_num_id"]
            isOneToOne: false
            referencedRelation: "ticket_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sold_out_number: {
        Row: {
          category: string
          created_at: string
          draw_date: string
          id: string
          number: number
        }
        Insert: {
          category: string
          created_at?: string
          draw_date: string
          id?: string
          number: number
        }
        Update: {
          category?: string
          created_at?: string
          draw_date?: string
          id?: string
          number?: number
        }
        Relationships: []
      }
      test_table: {
        Row: {
          id: string
          test_num: number[]
        }
        Insert: {
          id?: string
          test_num: number[]
        }
        Update: {
          id?: string
          test_num?: number[]
        }
        Relationships: []
      }
      ticket_numbers: {
        Row: {
          amount: number
          boxbet: boolean
          category: string[]
          draw_date: string
          gametype: string
          id: string
          number: number[]
        }
        Insert: {
          amount: number
          boxbet: boolean
          category: string[]
          draw_date: string
          gametype: string
          id?: string
          number: number[]
        }
        Update: {
          amount?: number
          boxbet?: boolean
          category?: string[]
          draw_date?: string
          gametype?: string
          id?: string
          number?: number[]
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          refer_to: string | null
          role: string | null
          tier: string
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          refer_to?: string | null
          role?: string | null
          tier: string
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          refer_to?: string | null
          role?: string | null
          tier?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
