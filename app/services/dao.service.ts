export class DAOService {            
    
    getActions(queryString: string): string [] {                
        return ["buy", "sell", "rent"];
    }
    
    getItems(queryString: string): string [] {     
        return ["socks", "shoes", "pants", "jacket", "handbag"];
    }
    
     getProperties(queryString: string): string [] {  
         return ["size", "shape", "color"];
     }
}