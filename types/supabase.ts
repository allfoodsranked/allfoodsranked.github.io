export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
      }
      foods: {
        Row: {
          created_at: string
          id: number
          image: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image?: string | null
          name?: string
        }
      }
      votes: {
        Row: {
          created_at: string | null
          food_id: number | null
          id: number
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string | null
          food_id?: number | null
          id?: number
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string | null
          food_id?: number | null
          id?: number
          user_id?: string
          value?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_rankings: {
        Args: Record<PropertyKey, never>
        Returns: {
          votes: number
          users: number
          name: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
