import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import './LandingPage.scss';

import { LocaleText } from '../../Contexts/LocaleContext';
import HomeScreen from '../HomeScreen/HomeScreen';
import Feed from '../Feed/Feed';


export default function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="landing-page">
      <HomeScreen />
      <div className="landing-info" id="landing-info">
        <h3 className="landing-title"><span><LocaleText phrase="landing/what_is" /></span></h3>
        <div className="landing-grid">
          <div data-aos="fade-up">
            <h4><span><LocaleText phrase="landing/the_chapter" /></span></h4>
            <p><LocaleText phrase="landing/about_chapter" /></p>
            <p className="landing-read-more">
              <a href="/committees">
                <LocaleText phrase="landing/read_more" />
...
              </a>
            </p>
          </div>
          <div data-aos="fade-up">
            <h4><span><LocaleText phrase="landing/the_program" /></span></h4>
            <p><LocaleText phrase="landing/about_education" /></p>
            <p className="landing-read-more">
              <a href="/medieteknik">
                <LocaleText phrase="landing/read_more" />
...
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="landing-feed">
        <Feed landingTitle />
      </div>
      <iframe src="https://calendar.google.com/calendar/embed?height=600&wkst=2&bgcolor=%23ffffff&ctz=Europe%2FStockholm&title=Sektionen%20f%C3%B6r%20Medieteknik&src=Y182cm1jMHRvcDRyYzRkZDM1bW10Yjl2Z21uMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23F6BF26" style="border:solid 1px #777" width="800" height="600" frameborder="0" scrolling="no"></iframe>
    </div>
  );
}
