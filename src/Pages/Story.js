import React, { useEffect, useState } from "react";
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import "../scss/style.scss";
import Navbar from "../components/Navbar";



function Story() {
    
    const [post, setPost] = useState({});

    const location = useLocation();
    const navigate = useNavigate();
  
    const postId = location.pathname.split("/")[2];
  
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/posts/${postId}`);
          setPost(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }, [postId]);
  
    const handleDelete = async ()=>{
    console.log("clicked");
    }
  


 

    return (
<div>


<div className="single">
      <div className="content"><br/>        <div className="user">
        <img src="https://drscdn.500px.org/photo/1064063439/m%3D900/v2?sig=52cbff4f6dcd5c35845735e2cb31b351926056836afa20fed37a19179be52c3a" alt="" />
          <div className="info">
            <span>Omar Ghamrawi</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
         
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <Edit/>
              </Link>
              <Delete onClick={handleDelete}/>
            </div>
          
        </div>
        <img src="https://drscdn.500px.org/photo/312536271/m%3D900/v2?sig=2eff5d32d77ce0fc9599e9536c0a531f5ca90309e796fa5d4fc86697938ed5f6" alt="" />

        <h1>The Years that changed Tripoli forever</h1>
        <p>Tripoli, the second biggest city in Lebanon after Beirut, have seen too much in the near past.
        In a conversation with my father who was living in Tripoli since he was 3 years old in 1972, he described to me how the city felt to him growing up, how the neighborhood had around 10 buildings, comparing to 70+ now, and it was all fields of Oranges, full of trees, and all the neighborhood allways smelled so good. He remembers playing in the fields, and in the wide streets with the neighbors... it was peaceful times he said, any kid would remember these days as peaceful. In the late 1970s to mid 1980s, as a result of a lot of political problems and tensions, a civil war sparked in the country. The peace that my father remembers as a kid, it all changed as he remembers patrolling in the neighborhood with other armed neighbors to watch over their neighborhood. It was really disturbing times, as the Syrian invasion to Lebanon was happening too, in the name of Assisting in solving the civil war, my father remembers every Siren sound that he heard as some bombs were dropped in the city... After many years things stabilized again in the city, but since then until this day, things are never the same, the city still feels wounded, as the whole country is. And I keep hearing all the elders, as my parents, says they hope the country come back to how it was.
        </p>      </div>
    </div>

</div>
    );
  

}

export default Story;
