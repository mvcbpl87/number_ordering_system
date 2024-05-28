import quickSort from '@/lib/game-utils/sort-algo/quicksort'
export class DateGenerator{
   
    constructor(){
        this.currDate = new Date();
        this.today = {
            time: this.currDate.getTime(),
            dayType: this.currDate.getDay(),
            day:this.currDate.getDate(),
            month:this.currDate.getMonth(),
            year:this.currDate.getFullYear(),
        }
    } // declare a real time Date
    
    timeStamp = (difference)=>{
        const multiplier = (1000*60*60*24)
        const newDate = this.today.time + (multiplier*difference)
        return new Date(newDate)
    }
    formatDate =(date)=>{
        const style = {dateStyle:'medium'}
        const f = new Intl.DateTimeFormat('en-us',style)
        return f.format(date)
    } // Format Date into standard prefixes
    formatTime = (time) =>{
        const style = {timeStyle:'medium'}
        const f = new Intl.DateTimeFormat('en-us',style)
        return f.format(time)
    }
    
}

export class DatePreset{
    // PRIVATE VARS FOR ONLY GETTING BELOW DAYS
    #WEDNESDAY = {name:'wednesday',code:3};
    #SATURDAY = {name:'saturday',code:6};
    #SUNDAY = {name:'sunday', code:0};
    #MAXREQUIRED = 4; // Max number of required predetermined data
    #WEEK = 7;

    constructor(){
        const date = new DateGenerator();
        this.DAYTYPE = date.today.dayType;
        this.timeStamp = date.timeStamp;
        this.Result = date.formatDate;
    }
    init_day = (day)=>{
        const this_name = day.toLowerCase();
        switch(this_name){
            case this.#WEDNESDAY.name:
                return this.#WEDNESDAY.code;
            case this.#SATURDAY.name:
                return this.#SATURDAY.code;
            case this.#SUNDAY.name:
                return this.#SUNDAY.code;
            default:
                return null;
        }
    } // INIT_DAY : defined desired days

    INSPECT_NEAREST_DAY = ()=>{
        const DICT = [
            {flag:this.#WEDNESDAY.name, value: null},
            {flag:this.#SATURDAY.name, value: null},
            {flag:this.#SUNDAY.name, value: null}
        ]
        const temp = DICT.map((date)=>{
            return {...date,value:this.DATE_THIS_WEEK(date.flag)}
        })
        const sorted = quickSort(temp,0,temp.length-1);
        const BluePrint = sorted.map(item => item.flag)
        return BluePrint
    } // INSPECT_NEAREST_DAY : Check the nearest to perform autocycle

    DATE_THIS_WEEK = (day)=>{
        const TIMEGAP = this.init_day(day)-this.DAYTYPE;
        return TIMEGAP >= 0 ? TIMEGAP : this.#WEEK + TIMEGAP;
    } // DATE_THIS_WEEK : Get this week date

    DATE_NEXT_WEEK = (day)=>{
        const TIMEGAP = this.init_day(day)-this.DAYTYPE;
        return TIMEGAP >= 0 ? this.#WEEK + TIMEGAP 
        : this.#WEEK * 2 + TIMEGAP;
    } // DATE_NEXT_WEEK : Get next week earlier

    GET_DRAW_DATE = ()=>{
        let content = [];
        const day = this.INSPECT_NEAREST_DAY();
        let count = 0;
        let time;
        for(let i = 0; i<this.#MAXREQUIRED; i++){
           
            if(i > 2) time = this.timeStamp(this.DATE_NEXT_WEEK(day[count]))
            if(i <= 2) time = this.timeStamp(this.DATE_THIS_WEEK(day[count]))

            content.push(this.Result(time))
            if(count == 2)  count = 0;
            else count++
        }
        return content
    }// GET_DRAW_DATE : Get 6 sets of draw dates
}