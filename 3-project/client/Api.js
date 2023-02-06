class Api {
  url = "";

  constructor(url) {
      this.url=url;
  }

  create(data) {

      const JSONData = JSON.stringify(data);
      console.log(`Sending ${JSONData} to ${this.url}`);

      const request = new Request(this.url, {
          method: "POST",
          body: JSONData,
          headers: {
              "content-type" : "application/json"
          }
      });


      return fetch(request).then(result => result.json()).then((data) => data).catch((err) => console.log(err));
  }

  getAll(){
      return fetch(this.url).then(result => result.json()).then((data) => data).catch((err) => console.log(err));
  }

  remove(ID) {
      console.log(`Removing employee with ID ${ID}`);

      return fetch(`${this.url}/${ID}`,{
          method: "DELETE"
      }).then((result)=> result).catch((err) => console.log(err));
  }




  update(ID, stampEmployee) {
      console.log(`Updating employee with ID ${ID}`);
      const JSONData = JSON.stringify({"stampEmployee": stampEmployee});
      return fetch(`${this.url}/${ID}`, {
        method: 'PUT',
        body: JSONData,
        headers: {"Content-Type": "application/json"}
      })
        .then((result) => result)
        .catch((err) => console.log(err));
    }
  }