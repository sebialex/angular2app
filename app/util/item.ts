/**
 * Author: Sebastian Stanisor
 */

/**
 * NOTE: NOT USED
 */
export class Property {       
    constructor(public name: string, public value: string){}            
}

export class Item {
    
    id: string;
    name: string;
    propertyList: Property [];
    propertyMap: Map<string, Property>;
    
    constructor() {
        this.propertyList = [];
        this.propertyMap = new Map<string, Property>();
    }
    
    addProperty(property: Property) {
        if (property != null && !this.propertyMap.has(property.name)) {
           this.propertyMap.set(property.name, property);
           this.propertyList.push(property);
        }
    }
    
    getProperty(name: string): Property {
        return this.propertyMap.get(name);
    }
}