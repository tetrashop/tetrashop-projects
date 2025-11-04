# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Intelligent Projects Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChessRequest(BaseModel):
    fen: str = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    depth: int = 4

class WriterRequest(BaseModel):
    topic: str
    style: str = "professional"
    max_length: int = 500

@app.post("/api/chess/analyze")
async def analyze_chess_position(request: ChessRequest):
    try:
        engine = IntelligentChessEngine(depth=request.depth)
        engine.board.set_fen(request.fen)
        
        best_move = engine.get_best_move()
        evaluation = engine._evaluate_board()
        
        return {
            "best_move": str(best_move),
            "evaluation": evaluation,
            "legal_moves": len(list(engine.board.legal_moves)),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/writer/generate")
async def generate_content(request: WriterRequest):
    try:
        writer = IntelligentContentWriter()
        article = writer.generate_article(
            topic=request.topic,
            style=request.style
        )
        
        return {
            "article": article,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
