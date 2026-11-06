export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_key: string;
          description: string | null;
          earned_at: string;
          icon: string | null;
          id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          badge_key: string;
          description?: string | null;
          earned_at?: string;
          icon?: string | null;
          id?: string;
          title: string;
          user_id: string;
        };
        Update: {
          badge_key?: string;
          description?: string | null;
          earned_at?: string;
          icon?: string | null;
          id?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          created_at: string;
          id: string;
          question_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          question_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          question_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookmarks_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: {
          communication_score: number;
          confidence_score: number;
          created_at: string;
          id: string;
          mock_interview_id: string;
          overall_rating: number;
          problem_solving_score: number;
          strengths: string[] | null;
          suggestions: string[] | null;
          summary: string | null;
          technical_score: number;
          user_id: string;
          weaknesses: string[] | null;
        };
        Insert: {
          communication_score: number;
          confidence_score: number;
          created_at?: string;
          id?: string;
          mock_interview_id: string;
          overall_rating: number;
          problem_solving_score: number;
          strengths?: string[] | null;
          suggestions?: string[] | null;
          summary?: string | null;
          technical_score: number;
          user_id: string;
          weaknesses?: string[] | null;
        };
        Update: {
          communication_score?: number;
          confidence_score?: number;
          created_at?: string;
          id?: string;
          mock_interview_id?: string;
          overall_rating?: number;
          problem_solving_score?: number;
          strengths?: string[] | null;
          suggestions?: string[] | null;
          summary?: string | null;
          technical_score?: number;
          user_id?: string;
          weaknesses?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: "feedback_mock_interview_id_fkey";
            columns: ["mock_interview_id"];
            isOneToOne: false;
            referencedRelation: "mock_interviews";
            referencedColumns: ["id"];
          },
        ];
      };
      interview_categories: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          question_count: number;
          slug: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          question_count?: number;
          slug: string;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          question_count?: number;
          slug?: string;
        };
        Relationships: [];
      };
      mock_interviews: {
        Row: {
          category_id: string | null;
          completed_at: string | null;
          created_at: string;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          duration_minutes: number | null;
          id: string;
          question_count: number;
          score: number | null;
          started_at: string;
          status: string;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          duration_minutes?: number | null;
          id?: string;
          question_count?: number;
          score?: number | null;
          started_at?: string;
          status?: string;
          user_id: string;
        };
        Update: {
          category_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          duration_minutes?: number | null;
          id?: string;
          question_count?: number;
          score?: number | null;
          started_at?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mock_interviews_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "interview_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          daily_streak: number;
          full_name: string | null;
          id: string;
          last_active_date: string | null;
          level: number;
          total_study_minutes: number;
          updated_at: string;
          xp: number;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          daily_streak?: number;
          full_name?: string | null;
          id: string;
          last_active_date?: string | null;
          level?: number;
          total_study_minutes?: number;
          updated_at?: string;
          xp?: number;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          daily_streak?: number;
          full_name?: string | null;
          id?: string;
          last_active_date?: string | null;
          level?: number;
          total_study_minutes?: number;
          updated_at?: string;
          xp?: number;
        };
        Relationships: [];
      };
      progress: {
        Row: {
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          id: string;
          notes: string | null;
          question_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          question_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          id?: string;
          notes?: string | null;
          question_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "progress_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          answer: string | null;
          category_id: string;
          created_at: string;
          difficulty: Database["public"]["Enums"]["difficulty_level"];
          id: string;
          question: string;
          tags: string[] | null;
          title: string;
        };
        Insert: {
          answer?: string | null;
          category_id: string;
          created_at?: string;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          id?: string;
          question: string;
          tags?: string[] | null;
          title: string;
        };
        Update: {
          answer?: string | null;
          category_id?: string;
          created_at?: string;
          difficulty?: Database["public"]["Enums"]["difficulty_level"];
          id?: string;
          question?: string;
          tags?: string[] | null;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "interview_categories";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty_level: "easy" | "medium" | "hard";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      difficulty_level: ["easy", "medium", "hard"],
    },
  },
} as const;
