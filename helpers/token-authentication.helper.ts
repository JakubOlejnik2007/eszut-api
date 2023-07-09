import { Request, Response, NextFunction } from "express"
import { Secret, verify } from "jsonwebtoken"
import config from "../config";

interface JWT_Request extends Request {
    user?: any
}

const authenticateToken = (req: JWT_Request, res: Response, next: NextFunction) => {
    // Pobierz nagłówek autoryzacyjny z żądania
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); // Brak tokena - brak autoryzacji
    }
  
    // Zweryfikuj i odczytaj dane uwierzytelniające z tokena
    verify(token, config.authentication.secret as Secret, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Błędny token - brak autoryzacji
      }
      req.user = user; // Przekaż dane uwierzytelniające do następnego middleware
      next();
    });
  }

export default authenticateToken;