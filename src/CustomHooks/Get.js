import instance from "../API";
import { useEffect, useState } from "react";

const useAxios = (url, options) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await instance.get(url);
          setData(response.data.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
  fetchData();
    }, [url, options]);
  
    return [loading, data];
  };
  
  export default useAxios;