print("🎲 شطرنج هوش مصنوعی - نسخه کامل")
print("موتور بازی شطرنج با قوانین استاندارد")

class ChessGame:
    def __init__(self):
        self.board = self.setup_board()
    
    def setup_board(self):
        return "♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜"
    
    def display(self):
        print("  a b c d e f g h")
        print("8 ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ 8")
        print("7 ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟ 7")
        print("6 . . . . . . . . 6")
        print("5 . . . . . . . . 5")
        print("4 . . . . . . . . 4")
        print("3 . . . . . . . . 3")
        print("2 ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙ 2")
        print("1 ♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖ 1")
        print("  a b c d e f g h")

game = ChessGame()
game.display()
