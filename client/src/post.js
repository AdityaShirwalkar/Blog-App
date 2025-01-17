import {formatISO9075} from "date-fns";

export default function Post({title,summary,cover,content,createAt}) {
    return (
        <div className="post">
          <div className="image">
            <img src="https://media.wired.com/photos/674705ece62bfbd1626a1416/master/w_1920,c_limit/GettyImages-1293014500.jpg" alt=""></img>
          </div>            
          <div className="texts">   
            <h2>{title}</h2>
            <p className="info" >
              <a className="author">John Doe</a>
              <time> { formatISO9075(new Date(createdAt))} </time>
            </p>
            <p className="summary"> {summary} </p>
          </div>
        </div>
    )
}