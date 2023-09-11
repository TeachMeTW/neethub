import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import fs from 'fs';
import path from 'path';
import { useState } from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import React, { useRef, useEffect } from 'react';

interface UserCardProps {
  name: string;
  imgSrc: string;
}

interface AppProps {
  images: string[];
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    };
  }

  const profilesDirectory = path.join(process.cwd(), 'public/images/profiles');
  let filenames:string[];
  try {
    filenames = fs.readdirSync(profilesDirectory);
  } catch (error) {
    console.error("Error fetching image filenames:", error);
    filenames = [];
  }

  const images = filenames.map(filename => `/images/profiles/${filename}`);

  return {
    props: { images }
  };
}

const UserCard: React.FC<UserCardProps> = ({ name, imgSrc }) => {
  return (
    <div className="group flex-row w-44 mx-auto">
      <div className="w-44 h-44 rounded-md flex items-center justify-center border-2 border-transparent group-hover:cursor-pointer group-hover:border-white overflow-hidden">
        <img draggable={false} className="w-max h-max object-contain" src={imgSrc} alt="" />
      </div>
      <div className="mt-4 text-gray-400 text-2xl text-center group-hover:text-white">{name}</div>
    </div>
  );
}

const App: React.FC<AppProps> = ({ images = [] }) => {
  
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const chunkSize = 6; // For example, show 6 profiles at a time
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const [visibleProfiles, setVisibleProfiles] = useState(chunkSize);

  const handleExpand = useCallback(() => {
    // Take a snapshot of the current scroll position.
    const currentScrollPosition = window.scrollY;
  
    setVisibleProfiles(prev => Math.min(prev + chunkSize, images.length));
  
    // Give the DOM a moment to update.
    requestAnimationFrame(() => {
      // Here you might need to adjust the 200 value which represents an estimated height of a profile (including its margins, padding, etc.).
      // Alternatively, you can dynamically calculate this value.
      window.scrollTo(0, currentScrollPosition + 200 * chunkSize);
    });
  }, [images.length]);

  const selectProfile = useCallback((imgSrc: string) => {
    // Only proceed if currentUser is defined and has an id
    if (currentUser && currentUser.id) {
      fetch('/api/updateProfileImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: currentUser.id,
          imgSrc
        })
      }).then(response => {
        if (response.ok) {
          router.push('/');
        } else {
          console.error('Failed to update profile image');
        }
      });
    } else {
      console.error('CurrentUser is not available.');
    }
  }, [router, currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center h-full justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl md:text-6xl text-white text-center">Who is gaming?</h1>
        
        <button onClick={toggleDropdown} className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Select Profile
        </button>

        {dropdownOpen && (
          <div className="mt-4 bg-zinc-800 p-4 rounded shadow-lg max-h-80 overflow-y-auto">
            <div className="flex flex-wrap items-center justify-center gap-8">
              {images.map((imgSrc, index) => (
                <div key={index} onClick={() => selectProfile(imgSrc)}>
                  <UserCard name={`Profile ${index + 1}`} imgSrc={imgSrc} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;