/**
 * Author: Sebastian Stanisor
 */

/**
 * This class is supposed to represent a data access object, which connects to a backend/persistence
 * layer and provides results to given queries.
 * 
 * This DAO would connect to a database such as mongoDB or and sql DB
 * For the purposes of this application, the values were hard coded
 */
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
        this.properties.set("socks", ["black", "blue", "brown", "green", "red"]);
        this.properties.set("jacket", ["small", "medium", "large"]);
        
                
        this.propertiesMap = new Map<string, Map<string,boolean>>();
        this.propertiesMap.set("shoes", DAOService.getMap(this.properties.get("shoes")));
        this.propertiesMap.set("handbag", DAOService.getMap(this.properties.get("handbag")));
        this.propertiesMap.set("pants", DAOService.getMap(this.properties.get("pants")));
        this.propertiesMap.set("socks", DAOService.getMap(this.properties.get("socks")));
        this.propertiesMap.set("jacket", DAOService.getMap(this.properties.get("jacket")));                      
    }
    
    /**
     * Returns a list of allowed actions
     */
    getActions(queryString: string): string [] {                       
        return DAOService.getListThatMatches(this.actions, queryString);
    }
    
    /**
     * Returns a list of allowed items for the given action, which match (partially or fully) the given
     * queryString
     */
    getItems(action: string, queryString: string): string [] {     
        return DAOService.getListThatMatches(this.items.get(action), queryString);
    }
    
    /**
     * Returns a list of allowed properties for the given item, which match (partially or fully) the given
     * queryString
     */
    getProperties(item: string, queryString: string): string [] { 
        return DAOService.getListThatMatches(this.properties.get(item), queryString);              
    }
    
    /**
     * Returns whether or not the given action is valid/exists
     */
    isActionValid(action: string): boolean {
        return this.actionMap.get(action);
    }
    
    /**
     * Returns whether or not the given item for the given action is valid/exists
     */
    isItemValid(action: string, item: string): boolean {
        return DAOService.isValid(action, item, this.itemsMap);  
    }
    
    /**
     * Returns whether or not the given property for the given item is valid/exists
     */
    isPropertyValid(item: string, property: string): boolean {       
        return DAOService.isValid(item, property, this.propertiesMap);               
    }
    
     /**
     * Returns whether or not the given price is valid
     */
    isPriceValid(price: string): boolean {
        if (price == null || price.trim() == "") {
            return false;
        }   
        return new RegExp("^[+-]?\\d+(\\.\\d*)?$").test(price);        
    }
    
    /**
     * Helper method which returns whether or not the given entity, belonging to the given prerequisite,
     * is valid. The map is the specific map where to look for this entity. To get the first level of the map
     * the prerequisite is used as key, and the entity is used as a key on the retireved map (if it exists)
     * 
     * @returns true if the entity was found and was valid or false otherwise
     */
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
        
    /**
     * Creates and returns a map from the given list. The map uses the list entries as keys and their values
     * are all set to the boolean: true
     */
    private static getMap(list: string[]): Map<string,boolean> {
        var map = new Map<string,boolean>();
        
        for (var i = 0, len = list.length; i < len; i++) {
            map.set(list[i], true);
        }
        
        return map;
    }
    
    /**
     * Returns a sublist of the given list, of items that match the search string
     * 
     * @return null if none match the search string, a subset or the entire list if all match  
     */    
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