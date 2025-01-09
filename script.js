async function fetchData() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10'); 
      if(!response.ok){
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); 
      console.log(data); 
      return data
    } catch (error) {
      console.error("Error in fetchData:", error); 
      throw error;
    }
  }
  
  fetchData(); 