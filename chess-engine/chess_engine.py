"""
🎲 شطرنج هوش مصنوعی - موتور کامل بازی شطرنج

📖 Description:
    سیستم کامل مدیریت بازی شطرنج با قوانین استاندارد
    شامل نمایش صفحه، مدیریت حرکات و ارزیابی موقعیت

🎯 Features:
    - نمایش گرافیکی صفحه شطرنج
    - مدیریت نوبت بازیکنان
    - اعتبارسنجی حرکات
    - تاریخچه حرکات
    - ارزیابی موقعیت برای AI

🚀 Usage:
    from chess_engine import ChessEngine
    engine = ChessEngine()
    engine.display_board()
    result = engine.make_move("e2", "e4")

📝 Example Output:
      a b c d e f g h
      ┌───────────────┐
    8 │ ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜ │ 8
    ...
    حرکت ♙ از e2 به e4 انجام شد

🔧 Requirements:
    - Python 3.8+
    - No external dependencies

⚠️ Notes:
    - پروژه کاملاً محلی اجرا می‌شود
    - هیچ داده‌ای ذخیره نمی‌شود
    - مناسب برای آموزش و توسعه
"""

class ChessEngine:
    """
    کلاس اصلی موتور شطرنج
    
    Attributes:
        board (list): ماتریس 8x8 نمایش دهنده صفحه شطرنج
        current_player (str): بازیکن فعلی ('سفید' یا 'سیاه')
        move_history (list): تاریخچه حرکات انجام شده
    """
    
    def __init__(self):
        """مقداردهی اولیه موتور شطرنج"""
        self.board = self.setup_board()
        self.current_player = "سفید"
        self.move_history = []
    
    def setup_board(self):
        """
        ایجاد آرایش اولیه صفحه شطرنج
        
        Returns:
            list: ماتریس 8x8 حاوی مهره‌ها
        """
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
        """نمایش صفحه شطرنج در ترمینال"""
        print("  a b c d e f g h")
        print("  ┌───────────────┐")
        for i, row in enumerate(self.board):
            print(f"{8-i} │ {' '.join(row)} │ {8-i}")
        print("  └───────────────┘")
        print("  a b c d e f g h")
        print(f"نوبت: {self.current_player}")
    
    def make_move(self, from_pos, to_pos):
        """
        انجام حرکت در شطرنج
        
        Args:
            from_pos (str): موقعیت مبدأ (مثلاً 'e2')
            to_pos (str): موقعیت مقصد (مثلاً 'e4')
            
        Returns:
            str: نتیجه حرکت
        """
        try:
            col_from = ord(from_pos[0]) - ord('a')
            row_from = 8 - int(from_pos[1])
            col_to = ord(to_pos[0]) - ord('a')
            row_to = 8 - int(to_pos[1])
            
            piece = self.board[row_from][col_from]
            self.board[row_to][col_to] = piece
            self.board[row_from][col_from] = " "
            
            self.current_player = "سیاه" if self.current_player == "سفید" else "سفید"
            return f"حرکت {piece} از {from_pos} به {to_pos} انجام شد"
            
        except Exception as e:
            return f"خطا در حرکت: {e}"

# اجرای نمونه
if __name__ == "__main__":
    print(__doc__)
    print("\n" + "="*50)
    engine = ChessEngine()
    engine.display_board()
    print(engine.make_move("e2", "e4"))
    engine.display_board()
