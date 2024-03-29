class APiResponse{
    constructor(statuscode, data, message){
        this.statuscode = statuscode;
        this.message = message;
        this.data = data;
        this.success = statuscode >= 200 && statuscode < 400
    }
}