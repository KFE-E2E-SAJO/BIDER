export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      auction: {
        Row: {
          auction_end_at: string;
          auction_id: string;
          auction_status: string;
          created_at: string;
          min_price: number;
          product_id: string;
          updated_at: string | null;
          winning_bid_id: string | null;
          winning_bid_user_id: string | null;
        };
        Insert: {
          auction_end_at: string;
          auction_id?: string;
          auction_status: string;
          created_at?: string;
          min_price: number;
          product_id: string;
          updated_at?: string | null;
          winning_bid_id?: string | null;
          winning_bid_user_id?: string | null;
        };
        Update: {
          auction_end_at?: string;
          auction_id?: string;
          auction_status?: string;
          created_at?: string;
          min_price?: number;
          product_id?: string;
          updated_at?: string | null;
          winning_bid_id?: string | null;
          winning_bid_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'auction_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product';
            referencedColumns: ['product_id'];
          },
          {
            foreignKeyName: 'Auction_winning_bid_id_fkey';
            columns: ['winning_bid_id'];
            isOneToOne: false;
            referencedRelation: 'bid_history';
            referencedColumns: ['bid_id'];
          },
          {
            foreignKeyName: 'auction_winning_bid_user_id_fkey';
            columns: ['winning_bid_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      bid_history: {
        Row: {
          auction_id: string;
          bid_at: string;
          bid_id: string;
          bid_price: number;
          bid_user_id: string;
          is_awarded: boolean;
        };
        Insert: {
          auction_id: string;
          bid_at?: string;
          bid_id?: string;
          bid_price: number;
          bid_user_id: string;
          is_awarded?: boolean;
        };
        Update: {
          auction_id?: string;
          bid_at?: string;
          bid_id?: string;
          bid_price?: number;
          bid_user_id?: string;
          is_awarded?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: 'bid_history_bid_user_id_fkey';
            columns: ['bid_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'BidHistory_auction_id_fkey';
            columns: ['auction_id'];
            isOneToOne: false;
            referencedRelation: 'auction';
            referencedColumns: ['auction_id'];
          },
        ];
      };
      chat_room: {
        Row: {
          auction_id: string;
          bid_user_id: string;
          chatroom_id: string;
          exhibit_user_id: string;
          updated_at: string | null;
        };
        Insert: {
          auction_id: string;
          bid_user_id: string;
          chatroom_id?: string;
          exhibit_user_id?: string;
          updated_at?: string | null;
        };
        Update: {
          auction_id?: string;
          bid_user_id?: string;
          chatroom_id?: string;
          exhibit_user_id?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_room_bid_user_id_fkey';
            columns: ['bid_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'chat_room_exhibit_user_id_fkey';
            columns: ['exhibit_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
          {
            foreignKeyName: 'ChatRoom_auction_id_fkey';
            columns: ['auction_id'];
            isOneToOne: false;
            referencedRelation: 'auction';
            referencedColumns: ['auction_id'];
          },
        ];
      };
      message: {
        Row: {
          chatroom_id: string;
          content: string;
          created_at: string;
          is_read: boolean;
          message_id: string;
          sender_id: string;
        };
        Insert: {
          chatroom_id: string;
          content: string;
          created_at?: string;
          is_read?: boolean;
          message_id?: string;
          sender_id: string;
        };
        Update: {
          chatroom_id?: string;
          content?: string;
          created_at?: string;
          is_read?: boolean;
          message_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'Message_chatroom_id_fkey';
            columns: ['chatroom_id'];
            isOneToOne: false;
            referencedRelation: 'chat_room';
            referencedColumns: ['chatroom_id'];
          },
          {
            foreignKeyName: 'message_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      product: {
        Row: {
          address: string;
          category: string;
          created_at: string;
          description: string;
          exhibit_user_id: string;
          latitude: number;
          longitude: number;
          product_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          address: string;
          category: string;
          created_at?: string;
          description: string;
          exhibit_user_id: string;
          latitude: number;
          longitude: number;
          product_id?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string;
          category?: string;
          created_at?: string;
          description?: string;
          exhibit_user_id?: string;
          latitude?: number;
          longitude?: number;
          product_id?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'product_exhibit_user_id_fkey';
            columns: ['exhibit_user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['user_id'];
          },
        ];
      };
      product_image: {
        Row: {
          image_id: string;
          image_url: string;
          order_index: number;
          product_id: string;
        };
        Insert: {
          image_id?: string;
          image_url: string;
          order_index?: number;
          product_id: string;
        };
        Update: {
          image_id?: string;
          image_url?: string;
          order_index?: number;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_image_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product';
            referencedColumns: ['product_id'];
          },
        ];
      };
      profiles: {
        Row: {
          address: string | null;
          created_at: string;
          email: string;
          latitude: number | null;
          longitude: number | null;
          nickname: string;
          profile_img: string | null;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          email: string;
          latitude?: number | null;
          longitude?: number | null;
          nickname: string;
          profile_img?: string | null;
          user_id: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          email?: string;
          latitude?: number | null;
          longitude?: number | null;
          nickname?: string;
          profile_img?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      bytea_to_text: {
        Args: { data: string };
        Returns: string;
      };
      get_my_bid_products_with_counts: {
        Args: { user_id: string };
        Returns: {
          auction_id: string;
          auction_data: Json;
          product_data: Json;
          product_images: Json;
          total_bid_count: number;
        }[];
      };
      http: {
        Args: { request: Database['public']['CompositeTypes']['http_request'] };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_delete: {
        Args: { uri: string } | { uri: string; content: string; content_type: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_get: {
        Args: { uri: string } | { uri: string; data: Json };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_head: {
        Args: { uri: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_header: {
        Args: { field: string; value: string };
        Returns: Database['public']['CompositeTypes']['http_header'];
      };
      http_list_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: {
          curlopt: string;
          value: string;
        }[];
      };
      http_patch: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_post: {
        Args: { uri: string; content: string; content_type: string } | { uri: string; data: Json };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_put: {
        Args: { uri: string; content: string; content_type: string };
        Returns: Database['public']['CompositeTypes']['http_response'];
      };
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      http_set_curlopt: {
        Args: { curlopt: string; value: string };
        Returns: boolean;
      };
      text_to_bytea: {
        Args: { data: string };
        Returns: string;
      };
      urlencode: {
        Args: { data: Json } | { string: string } | { string: string };
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      http_header: {
        field: string | null;
        value: string | null;
      };
      http_request: {
        method: unknown | null;
        uri: string | null;
        headers: Database['public']['CompositeTypes']['http_header'][] | null;
        content_type: string | null;
        content: string | null;
      };
      http_response: {
        status: number | null;
        content_type: string | null;
        headers: Database['public']['CompositeTypes']['http_header'][] | null;
        content: string | null;
      };
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
