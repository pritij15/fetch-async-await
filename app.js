let cl = console.log;

const  postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const loader = document.getElementById("loader");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

let baseUrl = `https://crud-posts-557f2-default-rtdb.asia-southeast1.firebasedatabase.app`;

let postUrl = `${baseUrl}/posts.json`

const makeApiCall = (apiUrl, methodName, msgBody = null) =>{

    return fetch(apiUrl, {
        method : methodName,
        body : msgBody,
        headers : {
            "content-type" : "Application/json"
        } 
    })
    .then(res =>{
       return res.json()
    })
}

const onEdit = (ele) =>{

    let getEditId = ele.closest(".card").id;
    localStorage.setItem("getEditId", getEditId);

    let editUrl = `${baseUrl}/posts/${getEditId}.json`;

    makeApiCall(editUrl, "GET")
    .then(data =>{
        titleControl.value = data.title;
        bodyControl.value = data.body;
        userIdControl.value = data.userId;

        updateBtn.classList.remove("d-none");
        submitBtn.classList.add("d-none");

    })
    .catch(err =>{
        cl(err)
    })
}

const onDelete = (ele) =>{
    cl(ele)

    let deleteId = ele.closest(".card").id;
    let deleteUrl = `${baseUrl}/posts/${deleteId}.json`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        }
      });  

      makeApiCall(deleteUrl, "DELETE")
      .then(res =>{
        cl(res)

        let card = document.getElementById(deleteId);
        card.remove()
      })
      .catch(cl)

}
const createPostCards = (post) =>{
    let card = document.createElement("div");
        card.className = "card mb-4";
        card.id = post.id;
        card.innerHTML = `
                            <div class="card-header">
                                <h2 class="m-0">
                                    ${post.title}
                                </h2>

                            </div>
                            <div class="card-body">
                                <p class="m-0">
                                    ${post.body}
                                </p>

                            </div>
                            <div class="card-footer d-flex justify-content-between">
                                <button class="btn btn-primary" type="button" onClick="onEdit(this)">Edit</button>
                                <button class="btn btn-danger" type="button" onClick="onDelete(this)">Delete</button>
                            </div>
                                 `
    postsContainer.append(card)                             

}

const templatingOfCards = (arr) =>{
    postsContainer.innerHTML = ``;
    arr.forEach(post =>{
        createPostCards(post)

    })
}

const objToArr = (resObj) =>{
    let resultArr = [];
    for(const key in resObj){
        let obj = resObj[key];
        obj.id = key;
        resultArr.push(obj)

    }
    return resultArr
}

makeApiCall(postUrl, "GET")
.then(data =>{
    //cl(data)
    let postArr = objToArr(data);
    //cl(postArr)
    templatingOfCards(postArr)
    Swal.fire({
                 title: "Good job!",
                 text: "All posts are fetched successfully!",
                 icon: "success"
               });
        

})
.catch(err => cl(err))

const onPostUpdate = () =>{
    let updatedObj = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(updatedObj)
    let updateId = localStorage.getItem("getEditId"); 
    let updateUrl = `${baseUrl}/posts/${updateId}.json`;

    makeApiCall(updateUrl, "PUT", JSON.stringify(updatedObj))
        .then(res =>{
            cl(res);
            let card = [...document.getElementById(updateId).children];
            cl(card)

            card[0].innerHTML = `<h2 class="m-0">${res.title}</h2>`;
            card[1].innerHTML = `<p class="m-0">${res.body}</p>`;
            Swal.fire({
                title: "Good job!",
                text: "Post is updated successfully!",
                icon: "success"
              });
        })
        .catch(cl)
        .finally(()=>{
            postForm.reset();
            updateBtn.classList.add("d-none");
            submitBtn.classList.remove("d-none");

        })
}

const onPostCreate = (eve) =>{
    eve.preventDefault();
    let newPost = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(newPost)

    makeApiCall(postUrl, "POST", JSON.stringify(newPost))
        .then(res =>{
            cl(res)
            newPost.id = res.name;
            createPostCards(newPost)
            Swal.fire({
                title: "Good job!",
                text: "New post is created successfully!",
                icon: "success"
              });
        
        })
        .catch(err =>{
            cl(err)
        })
        .finally(()=>{
            postForm.reset()
        })
}

updateBtn.addEventListener("click", onPostUpdate);
postForm.addEventListener("submit", onPostCreate);


   