import uvicorn
from config.api import settings

if __name__ == "__main__":
    uvicorn.run(
        "server:app",              
        host="0.0.0.0",            
        port=settings.APP_PORT,    
        reload=True         
    )
