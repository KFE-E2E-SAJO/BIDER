export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
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
            referencedRelation: 'user';
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
            referencedRelation: 'user';
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
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          auction_id: string;
          bid_user_id: string;
          chatroom_id?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Update: {
          auction_id?: string;
          bid_user_id?: string;
          chatroom_id?: string;
          created_at?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'chat_room_bid_user_id_fkey';
            columns: ['bid_user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
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
          message_type: string;
          sender_id: string;
        };
        Insert: {
          chatroom_id: string;
          content: string;
          created_at?: string;
          is_read?: boolean;
          message_id?: string;
          message_type: string;
          sender_id: string;
        };
        Update: {
          chatroom_id?: string;
          content?: string;
          created_at?: string;
          is_read?: boolean;
          message_id?: string;
          message_type?: string;
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
            referencedRelation: 'user';
            referencedColumns: ['user_id'];
          },
        ];
      };
      pending_auction: {
        Row: {
          auction_end_at: string;
          auction_status: string;
          completed_at: string | null;
          created_at: string;
          min_price: number;
          pending_auction_id: string;
          product_id: string;
          scheduled_create_at: string;
        };
        Insert: {
          auction_end_at: string;
          auction_status?: string;
          completed_at?: string | null;
          created_at?: string;
          min_price: number;
          pending_auction_id?: string;
          product_id: string;
          scheduled_create_at: string;
        };
        Update: {
          auction_end_at?: string;
          auction_status?: string;
          completed_at?: string | null;
          created_at?: string;
          min_price?: number;
          pending_auction_id?: string;
          product_id?: string;
          scheduled_create_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pending_auction_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'product';
            referencedColumns: ['product_id'];
          },
        ];
      };
      product: {
        Row: {
          address: string | null;
          category: string | null;
          created_at: string;
          description: string;
          exhibit_user_id: string | null;
          latitude: number;
          longitude: number;
          product_id: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          address?: string | null;
          category?: string | null;
          created_at?: string;
          description: string;
          exhibit_user_id?: string | null;
          latitude: number;
          longitude: number;
          product_id?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          address?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string;
          exhibit_user_id?: string | null;
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
            referencedRelation: 'user';
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
      user: {
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
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
