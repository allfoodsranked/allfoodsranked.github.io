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
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
      }
      category_tags: {
        Row: {
          category_id: number
          created_at: string | null
          food_id: number | null
          id: number
        }
        Insert: {
          category_id?: number
          created_at?: string | null
          food_id?: number | null
          id?: number
        }
        Update: {
          category_id?: number
          created_at?: string | null
          food_id?: number | null
          id?: number
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
          category_id: number | null
          created_at: string | null
          food_id: number
          id: number
          user_id: string
          value: number
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          food_id: number
          id?: number
          user_id: string
          value?: number
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          food_id?: number
          id?: number
          user_id?: string
          value?: number
        }
      }
    }
    Views: {
      category_foods: {
        Row: {
          category: string | null
          category_id: number | null
          food_id: number | null
          name: string | null
        }
      }
      category_rankings: {
        Row: {
          category: string | null
          category_id: number | null
          food_id: number | null
          name: string | null
          users: number | null
          votes: number | null
        }
      }
      rankings: {
        Row: {
          food_id: number | null
          name: string | null
          users: number | null
          votes: number | null
        }
      }
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
