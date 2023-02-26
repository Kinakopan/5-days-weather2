import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const images = ['/bg/sunny.jpg', '/bg/rainy.jpg', '/bg/snowy.jpg'];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((currentImage + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [currentImage]);

  const imageStyle = {
    opacity: 1,
    transition: "opacity 1s ease-in-out",
  };

  const apiKey = process.env.API_KEY;
  const location = "vancouver";
  const units = "metric";

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${units}&appid=${apiKey}`;
  //1. first line of "Examples of API calls" in the doc, 2. add "q=${location}"", 3. add "&units=${units}"", 4. add "&appid=${apiKey}""

  const [data, setData] = useState();
  const grabWeather = useRef(false);

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await axios.get(url);
      console.log(response);

      console.log(response.data.list);
      const arrayOfDays = [];

      let weatherData = response.data.list.map((weather, index) => {//debug for `AxiosError: Request failed with status code 401`
        console.log(parseInt(weather.dt_txt.substr(8,2), 10))
        let num = parseInt(weather.dt_txt.substr(8,2), 10);

        if(num !== arrayOfDays.find(element => element === num)) {
          arrayOfDays.push(num);
          console.log("Here");
          console.log(response.data.list[index])
          var month = '';
          var icon = '';

          if(weather.dt_txt.substr(5,2) == 1) {
            month = "January"
          } else if(weather.dt_txt.substr(5,2) == 2) {
            month = "February"
          } else if(weather.dt_txt.substr(5,2) == 3) {
            month = "March"
          } else if(weather.dt_txt.substr(5,2) == 4) {
            month = "April"
          } else if(weather.dt_txt.substr(5,2) == 5) {
            month = "May"
          } else if(weather.dt_txt.substr(5,2) == 6) {
            month = "June"
          } else if(weather.dt_txt.substr(5,2) == 7) {
            month = "July"
          } else if(weather.dt_txt.substr(5,2) == 8) {
            month = "August"
          } else if(weather.dt_txt.substr(5,2) == 9) {
            month = "September"
          } else if(weather.dt_txt.substr(5,2) == 10) {
            month = "October"
          } else if(weather.dt_txt.substr(5,2) == 11) {
            month = "November"
          } else if(weather.dt_txt.substr(5,2) == 12) {
            month = "December"
          }

          if(weather.weather[0].main == 'Clouds') { //Just create icons for MAIN weathers -> https://openweathermap.org/weather-conditions
            icon = '/icons/broken-clouds.png'
          } else if(weather.weather[0].main == 'Clear') {//sun
            icon = '/icons/clear-sky.png'
          } else if(weather.weather[0].main == 'Atmosphere') {
            icon = '/icons/mist.png'
          } else if(weather.weather[0].main == 'Rain') {
            icon = '/icons/rain.png'
          } else if(weather.weather[0].main == 'Drizzle') {
            icon = '/icons/shower-rain.png'
          } else if(weather.weather[0].main == 'Snow') {
            icon = '/icons/snow.png'
          } else if(weather.weather[0].main == 'Thunderstorm') {
            icon = '/icons/thunderstorm.png'
          }

          var now = new Date(weather.dt_txt);
          var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          var day = days[now.getDate()];
          console.log(icon);

          return (
            <div
              key={index}
              className={styles.item}>
              <div className={`${styles.item_box_icon} ${styles.bounce}`}>
                <Image
                  src={icon}
                  alt={icon}
                  className={styles.item_img}
                  width={180}
                  height={180}
                  priority
                  />
              </div>
                <ul className={styles.item_txt}>
                  <li className={styles.item_txt_date}>
                    {day}<br />
                    {month} {weather.dt_txt.substr(8,2)},
                    {weather.dt_txt.substr(0,4)}
                  </li>
                  <li className={styles.item_txt_main}>
                    {weather.weather[0].main}
                  </li>
                  <li className={styles.item_txt_temp}>
                    {weather.main.temp.toFixed(1)} °C
                  </li>
                </ul>
            </div>
          )
        }
      })
      console.log(arrayOfDays);
      setData(weatherData);
    }

    // if(grabWeather.current === true) {
      fetchWeather();
    // }

    // return () => {
    //   grabWeather.current = true;
    // }
  }, []);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className={styles.wrapper}>
        {images.map((image, index) => (
          <img
            className={styles.bgImg}
            key={index}
            src={image}
            alt=""
            style={{ ...imageStyle, opacity: index === currentImage ? 1 : 0 }}>
          </img>
        ))}

        <main className={styles.main}>

          <div className={styles.header}>
            <div className={styles.box_logo}>
              <Image
                className={styles.logo}
                src="/logo.png" //Design logo on your own & FAVICON!
                alt="logo"
                width={300}
                height={100}
                priority
              />
            </div>

            <ul className={styles.cont_description}>
              <li className={styles.description_title}>
                <ul>
                  <li>
                    Vancouver, B.C. Weather
                  </li>
                  <li>
                    <a
                      href="https://github.com/Kinakopan?tab=repositories"
                      target="_blank"
                      rel="noopener noreferrer"
                      >By{' '}Mio
                    </a>
                  </li>
                </ul>
              </li>
              <li  className={styles.description_updated}>
                Last Updates: {date}
              </li>

            </ul>

          </div>

          <div className={styles.grid}>
            {data}
          </div>
        </main>{/* main */}
      </div>{/* wrapper */}
    </>
  )
}
