# شطرنج هوش مصنوعی - نسخه حرفه‌ای
class ChessEngine:
    def __init__(self):
        self.board = self.setup_board()
        self.current_player = "سفید"
        self.move_history = []
        self.piece_values = {
            "♟": 1, "♙": 1, "♞": 3, "♘": 3, "♝": 3, "♗": 3,
            "♜": 5, "♖": 5, "♛": 9, "♕": 9, "♚": 0, "♔": 0
        }
    
    def setup_board(self):
        return [
            ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
            ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
            ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
        ]
    
    def display_board(self):
        print("  a b c d e f g h")
        print("  ┌───────────────┐")
        for i, row in enumerate(self.board):
            print(f"{8-i} │ {' '.join(row)} │ {8-i}")
        print("  └───────────────┘")
        print("  a b c d e f g h")
        print(f"نوبت: {self.current_player}")
        print(f"تعداد حرکات: {len(self.move_history)}")
    
    def make_move(self, from_pos, to_pos):
        try:
            col_from = ord(from_pos[0]) - ord('a')
            row_from = 8 - int(from_pos[1])
            col_to = ord(to_pos[0]) - ord('a')
            row_to = 8 - int(to_pos[1])
            
            if not (0 <= col_from < 8 and 0 <= row_from < 8):
                return "خطا: موقعیت مبدأ نامعتبر"
            
            piece = self.board[row_from][col_from]
            if piece == " ":
                return "خطا: مهره‌ای در موقعیت مبدأ نیست"
            
            # ذخیره حرکت
            move_info = {
                'piece': piece,
                'from': from_pos,
                'to': to_pos,
                'player': self.current_player
            }
            self.move_history.append(move_info)
            
            # انجام حرکت
            captured = self.board[row_to][col_to]
            self.board[row_to][col_to] = piece
            self.board[row_from][col_from] = " "
            
            # تغییر نوبت
            self.current_player = "سیاه" if self.current_player == "سفید" else "سفید"
            
            result = f"حرکت {piece} از {from_pos} به {to_pos}"
            if captured != " ":
                result += f" (زدن {captured})"
            
            return result
            
        except Exception as e:
            return f"خطا در حرکت: {e}"
    
    def evaluate_position(self):
        """ارزیابی موقعیت صفحه برای AI"""
        score = 0
        for row in self.board:
            for piece in row:
                if piece != " ":
                    value = self.piece_values.get(piece, 0)
                    if piece.islower():  # سیاه
                        score -= value
                    else:  # سفید
                        score += value
        return score
    
    def get_game_status(self):
        return {
            'current_player': self.current_player,
            'total_moves': len(self.move_history),
            'position_score': self.evaluate_position(),
            'last_move': self.move_history[-1] if self.move_history else None
        }

print("🎲 شطرنج هوش مصنوعی - نسخه حرفه‌ای")
print("=" * 50)
engine = ChessEngine()
engine.display_board()

# انجام چند حرکت نمونه
moves = [("e2", "e4"), ("e7", "e5"), ("g1", "f3"), ("b8", "c6")]
for from_pos, to_pos in moves:
    result = engine.make_move(from_pos, to_pos)
    print(f"📝 {result}")

engine.display_board()
status = engine.get_game_status()
print(f"📊 وضعیت بازی: {status['current_player']} - امتیاز: {status['position_score']}")
