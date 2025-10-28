import React from 'react';
//import placeholderLogo from './assets/logos/placeholderLogo.png';
import './landingAndLogin.css'

interface LandingPageProps {

}

const LandingPage: React.FC<LandingPageProps> = ({}) => {
      return (
        <div className = "centeredBox">
            <p>This is my brand new page content.</p>
          {/* Add more JSX elements and components here */}
        </div>
      );
    };

export default LandingPage;