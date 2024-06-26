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
      "metadata.development": {
        Row: {
          current_season: string | null
          id: number
          oldest_unanswered_question: string
        }
        Insert: {
          current_season?: string | null
          id?: number
          oldest_unanswered_question: string
        }
        Update: {
          current_season?: string | null
          id?: number
          oldest_unanswered_question?: string
        }
        Relationships: []
      }
      "metadata.production": {
        Row: {
          current_season: string | null
          id: number
          oldest_unanswered_question: string
        }
        Insert: {
          current_season?: string | null
          id?: number
          oldest_unanswered_question: string
        }
        Update: {
          current_season?: string | null
          id?: number
          oldest_unanswered_question?: string
        }
        Relationships: []
      }
      "questions.development": {
        Row: {
          answer: string | null
          answered: boolean
          answeredTimestamp: string | null
          answeredTimestampMs: number | null
          answerRaw: string | null
          askedTimestamp: string | null
          askedTimestampMs: number | null
          author: string
          id: string
          program: string
          question: string
          questionRaw: string
          season: string
          tags: string[]
          title: string
          url: string
        }
        Insert: {
          answer?: string | null
          answered: boolean
          answeredTimestamp?: string | null
          answeredTimestampMs?: number | null
          answerRaw?: string | null
          askedTimestamp?: string | null
          askedTimestampMs?: number | null
          author: string
          id: string
          program: string
          question: string
          questionRaw: string
          season: string
          tags: string[]
          title: string
          url: string
        }
        Update: {
          answer?: string | null
          answered?: boolean
          answeredTimestamp?: string | null
          answeredTimestampMs?: number | null
          answerRaw?: string | null
          askedTimestamp?: string | null
          askedTimestampMs?: number | null
          author?: string
          id?: string
          program?: string
          question?: string
          questionRaw?: string
          season?: string
          tags?: string[]
          title?: string
          url?: string
        }
        Relationships: []
      }
      "questions.production": {
        Row: {
          answer: string | null
          answered: boolean
          answeredTimestamp: string | null
          answeredTimestampMs: number | null
          answerRaw: string | null
          askedTimestamp: string | null
          askedTimestampMs: number | null
          author: string
          id: string
          program: string
          question: string
          questionRaw: string
          season: string
          tags: string[]
          title: string
          url: string
        }
        Insert: {
          answer?: string | null
          answered: boolean
          answeredTimestamp?: string | null
          answeredTimestampMs?: number | null
          answerRaw?: string | null
          askedTimestamp?: string | null
          askedTimestampMs?: number | null
          author: string
          id: string
          program: string
          question: string
          questionRaw: string
          season: string
          tags: string[]
          title: string
          url: string
        }
        Update: {
          answer?: string | null
          answered?: boolean
          answeredTimestamp?: string | null
          answeredTimestampMs?: number | null
          answerRaw?: string | null
          askedTimestamp?: string | null
          askedTimestampMs?: number | null
          author?: string
          id?: string
          program?: string
          question?: string
          questionRaw?: string
          season?: string
          tags?: string[]
          title?: string
          url?: string
        }
        Relationships: []
      }
      "renotify_queue.development": {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "renotify.development_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "questions.development"
            referencedColumns: ["id"]
          },
        ]
      }
      "renotify_queue.production": {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "renotify_queue.production_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "questions.development"
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
