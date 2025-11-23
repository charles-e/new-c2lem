module.exports = {
    eleventyComputed: {
        //test: data =>  data.date_posted && data.date_posted.getTime(),
        date_posted_ms: function (data){
            //console.log('data:', data);
            //console.log('posted_date: '+ data.date_posted);
            if (data.date_posted) { 
            //console.log ('date: '+new Date(data.date_posted));
             return data.date_posted && (new Date(data.date_posted)).getTime();
        } else {
            return null;
        }
    }
    }
};