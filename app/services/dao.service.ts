export class DAOService {            
        
    actions = ["buy", "sell", "rent"];    
    actionMap: Map<string,boolean>;
    
    itemSet: Set<string>;    
    items: Map<string,string []>;
    itemsMap: Map<string, Map<string,boolean>>;
    
    properties: Map<string,string []>;
    propertiesMap: Map<string, Map<string,boolean>>;
    
    constructor() {
        
        this.actionMap = DAOService.getMap(this.actions);
                
        this.items = new Map<string,string []>(); 
        this.items.set("buy", ["socks", "shoes", "pants", "jacket", "handbag"]);   
        this.items.set("sell", ["shoes", "jacket", "handbag"]);   
        this.items.set("rent", ["jacket", "handbag"]);   
        
        this.itemsMap = new Map<string, Map<string,boolean>>();
        this.itemsMap.set("buy", DAOService.getMap(this.items.get("buy")));
        this.itemsMap.set("sell", DAOService.getMap(this.items.get("sell")));
        this.itemsMap.set("rent", DAOService.getMap(this.items.get("rent")));
                
        this.properties = new Map<string,string []>();             
        this.properties.set("shoes", ["running", "derby", "slipper", "moccasin", "jelly"]);
        this.properties.set("handbag", ["bucket", "box", "satchel", "sling", "shoulder"]);
        this.properties.set("pants", ["28", "29", "30", "31", "32" , "33"]);
        this.properties.set("socks", ["black", "blue", "brawn", "green", "red"]);
        this.properties.set("jacket", ["small", "medium", "large"]);
        
                
        this.propertiesMap = new Map<string, Map<string,boolean>>();
        this.propertiesMap.set("shoes", DAOService.getMap(this.properties.get("shoes")));
        this.propertiesMap.set("handbag", DAOService.getMap(this.properties.get("handbag")));
        this.propertiesMap.set("pants", DAOService.getMap(this.properties.get("pants")));
        this.propertiesMap.set("socks", DAOService.getMap(this.properties.get("socks")));
        this.propertiesMap.set("jacket", DAOService.getMap(this.properties.get("jacket")));                      
    }
    
    getActions(queryString: string): string [] {                       
        return DAOService.getListThatMatches(this.actions, queryString);
    }
    
    getItems(action: string, queryString: string): string [] {     
        return DAOService.getListThatMatches(this.items.get(action), queryString);
    }
    
    getProperties(item: string, queryString: string): string [] { 
        return DAOService.getListThatMatches(this.properties.get(item), queryString);              
    }
    
    isActionValid(action: string): boolean {
        return this.actionMap.get(action);
    }
    
    isItemValid(action: string, item: string): boolean {
        return DAOService.isValid(action, item, this.itemsMap);  
    }
    
    isPropertyValid(item: string, property: string): boolean {       
        return DAOService.isValid(item, property, this.propertiesMap);               
    }
    
    isPriceValid(price: string): boolean {
        if (price == null || price.trim() == "") {
            return false;
        }
        
        var patt = new RegExp("^[+-]?\\d+(\\.\\d*)?$");        
        return patt.test(price);        
    }
    
    private static isValid(prerequisite: string, entity: string, map: Map<string, Map<string,boolean>>): boolean {
         if (prerequisite == null || entity == null) {
            return false;
        }
        
        var entityMap = map.get(prerequisite);
        
        if (entityMap) {
             return entityMap.get(entity);
        }
        else {
            false;
        }
    }
        
    private static getMap(list: string[]): Map<string,boolean> {
        var map = new Map<string,boolean>();
        
        for (var i = 0, len = list.length; i < len; i++) {
            map.set(list[i], true);
        }
        
        return map;
    }
        
    private static getListThatMatches(list: string[], searchStr: string): string [] {
  
        if (searchStr == null || list == null) {
            return null;
        }

        if (searchStr == "") {
            return list;
        }

        searchStr = searchStr.trim();
        
        if (searchStr === "") {
            return null;
        }
        
        if (list) {
            var result = null;
            for (var i = 0, len = list.length; i < len; i++) {
                var prop = list[i];
                if (prop.indexOf(searchStr) == 0) {
                    if (result == null) {
                        result = [];
                    }
                    result.push(prop);
                }
            }
            
            return result;
        }
        else {
            return null;
        }  
    }
}