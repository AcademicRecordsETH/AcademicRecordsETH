export class ArrayUtil {

    static updateArray(array: any[], element: any): any[] {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
            if ('' + array[i].id === '' + element.id) {
                newArray.push(element);
            } else {
                newArray.push(array[i]);
            }
        }
        return newArray;
    }
}
