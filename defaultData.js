const Products =require("./model/product");
const productsData=require("./productsData");
const DefaultData=async()=>{
    try{
        await Products.deleteMany({});
        const storeData=await Products.insertMany(productsData);
        console.log(storeData)
    }
    catch(e){
        console.log(e)
    }
}
module.exports=DefaultData;