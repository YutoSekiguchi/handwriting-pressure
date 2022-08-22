import type { NextPage } from 'next'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head'
import AppHeader from '../components/common/AppHeader';

const Home: NextPage = () => {
	return (
    <>
      <div className='fixed w-full h-full bg-gray-900'>
        <AppHeader />
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
        <h1>HOME</h1>
      </div>
    </>
	);
}

export default Home