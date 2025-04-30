export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          food_item_id: string
          id: string
          ngo_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          food_item_id: string
          id?: string
          ngo_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          food_item_id?: string
          id?: string
          ngo_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          category: Database["public"]["Enums"]["food_category"]
          created_at: string
          description: string | null
          expiry_date: string
          id: string
          name: string
          pickup_instructions: string | null
          provider_id: string
          provider_name: string
          quantity: number
          quantity_unit: string
          status: Database["public"]["Enums"]["food_status"]
        }
        Insert: {
          category: Database["public"]["Enums"]["food_category"]
          created_at?: string
          description?: string | null
          expiry_date: string
          id?: string
          name: string
          pickup_instructions?: string | null
          provider_id: string
          provider_name: string
          quantity: number
          quantity_unit: string
          status?: Database["public"]["Enums"]["food_status"]
        }
        Update: {
          category?: Database["public"]["Enums"]["food_category"]
          created_at?: string
          description?: string | null
          expiry_date?: string
          id?: string
          name?: string
          pickup_instructions?: string | null
          provider_id?: string
          provider_name?: string
          quantity?: number
          quantity_unit?: string
          status?: Database["public"]["Enums"]["food_status"]
        }
        Relationships: []
      }
      order_items: {
        Row: {
          food_item_id: string
          id: string
          order_id: string
          provider_id: string
          provider_name: string
          quantity: number
        }
        Insert: {
          food_item_id: string
          id?: string
          order_id: string
          provider_id: string
          provider_name: string
          quantity: number
        }
        Update: {
          food_item_id?: string
          id?: string
          order_id?: string
          provider_id?: string
          provider_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          contact_person: string
          contact_phone: string
          created_at: string
          id: string
          ngo_id: string
          ngo_name: string
          notes: string | null
          pickup_time: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          contact_person: string
          contact_phone: string
          created_at?: string
          id?: string
          ngo_id: string
          ngo_name: string
          notes?: string | null
          pickup_time: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          contact_person?: string
          contact_phone?: string
          created_at?: string
          id?: string
          ngo_id?: string
          ngo_name?: string
          notes?: string | null
          pickup_time?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: []
      }
      users: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          people_served: number | null
          phone: string | null
          provider_type: string | null
          registration_number: string | null
          user_type: string
          username: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          people_served?: number | null
          phone?: string | null
          provider_type?: string | null
          registration_number?: string | null
          user_type: string
          username: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          people_served?: number | null
          phone?: string | null
          provider_type?: string | null
          registration_number?: string | null
          user_type?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      food_category: "prepared" | "grocery" | "produce" | "bakery" | "dairy" | "other"
      food_status: "available" | "claimed" | "expired"
      order_status: "placed" | "confirmed" | "ready" | "completed" | "cancelled"
      user_type: "provider" | "ngo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      food_category: ["prepared", "grocery", "produce", "bakery", "dairy", "other"],
      food_status: ["available", "claimed", "expired"],
      order_status: ["placed", "confirmed", "ready", "completed", "cancelled"],
      user_type: ["provider", "ngo"],
    },
  },
} as const
