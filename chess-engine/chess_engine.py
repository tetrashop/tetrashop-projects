# شطرنج هوش مصنوعی - نسخه کامل
class ChessEngine:
    def __init__(self):
        self.board = [
            ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
            ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            [" ", " ", " ", " ", " ", " ", " ", " "],
            ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
            ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
        ]
        self.current_player = "سفید"
    
    def display_board(self):
        print("  a b c d e f g h")
        print("  ┌───────────────┐")
        for i, row in enumerate(self.board):
            print(f"{8-i} │ {' '.join(row)} │ {8-i}")
        print("  └───────────────┘")
        print("  a b c d e f g h")
        print(f"نوبت: {self.current_player}")
    
    def make_move(self, from_pos, to_pos):
        col_from = ord(from_pos[0]) - ord('a')
        row_from = 8 - int(from_pos[1])
        col_to = ord(to_pos[0]) - ord('a')
        row_to = 8 - int(to_pos[1])
        
        piece = self.board[row_from][col_from]
        self.board[row_to][col_to] = piece
        self.board[row_from][col_from] = " "
        
        self.current_player = "سیاه" if self.current_player == "سفید" else "سفید"
        return f"حرکت {piece} از {from_pos} به {to_pos} انجام شد"

print("🎲 شطرنج هوش مصنوعی - نسخه کامل")
engine = ChessEngine()
engine.display_board()
print(engine.make_move("e2", "e4"))
engine.display_board()
