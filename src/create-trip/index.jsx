// import React from 'react'
import { Input } from "@/components/ui/input";
import LocationAutocomplete from "./LocationAutocomplete"
import { useEffect, useState} from 'react';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelLists } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { chatSession } from "@/service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog"

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import * as axios from "axios";



function CreateTrip() {

  const { toast } = useToast()

  const [place, setPlace] = useState(null); // Define place here
  const [openDialog, setOpenDialog]=useState(false);
  const [formData, setFormData] = useState([]);

  const handleInputChange = (name, value) =>{
    setFormData({
      ...formData,
      [name]:value
    })
  }

  useEffect(()=>{
    console.log(formData)
  }, [formData])

  const login = useGoogleLogin({
    onSuccess:(codeResp)=>GetUserProfile(codeResp),
  })

  const OnGenerateTrip = async () => {

    const user=localStorage.getItem('user');
    
    if(!user){
      setOpenDialog(true);
      return ;
    }

    if(formData?.noOfDays>5 && !formData?.location || !formData?.budget || !formData?.traveler){
      toast({
        title: "Warning",
        description: "Please Fill All The Details.",
      })
      return ;
    }
    const FINAL_PROMPT = AI_PROMPT
      .replace("{location}", formData?.location?.label)
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays)

    console.log(FINAL_PROMPT);

    const result=await chatSession.sendMessage(FINAL_PROMPT);
    console.log(result?.response?.text());
  }

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?.acess_token=${tokenInfo?.access_token}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenInfo?.access_token}`
      }
    }).then((resp)=>{
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-bold text-4xl text-gray-900 mb-4 font-sans">
            Design Your Perfect Journey
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Let our AI craft a personalized travel experience tailored just for you. Share your preferences, and watch your dream trip come to life.
          </p>
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="space-y-12">
            {/* Destination Section */}
            <div className="border-b border-gray-100 pb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Where would you like to go?
              </h2>
              <LocationAutocomplete
                selectProps={{
                  place,
                  onChange: (v) => {
                    setPlace(v);
                    handleInputChange('location', v);
                  }
                }}
              />
            </div>

            {/* Duration Section */}
            <div className="border-b border-gray-100 pb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Trip Duration
              </h2>
              <Input
                placeholder="Number of days"
                type="number"
                className="max-w-xlg text-lg py-6"
                onChange={(e) => handleInputChange('noOfDays', e.target.value)}
              />
            </div>

            {/* Budget Section */}
            <div className="border-b border-gray-100 pb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Budget Range
              </h2>
              <p className="text-gray-500 mb-6">
                Select your preferred budget for activities and dining
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('budget', item.title)}
                    className={`relative group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02]
                    ${formData?.budget==item.title&&'shadow-lg border-blue-200'}
                    `}
                  >
                    <div className="text-5xl mb-4 text-blue-500">{item.icon}</div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Companions Section */}
            <div className="pb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Travel Companions
              </h2>
              <p className="text-gray-500 mb-6">
                Who will be joining you on this adventure?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {SelectTravelLists.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('traveler', item.numberOfPeople)}
                    className={`relative group bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:scale-[1.02]
                    ${formData?.traveler==item.numberOfPeople&&'shadow-lg border-blue-200'}`
                    }
                  >
                    <div className="text-5xl mb-4 text-blue-500">{item.icon}</div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end pt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              onClick={OnGenerateTrip}
            >
              Generate Your Trip
            </Button>
          </div>

          <Dialog open={openDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogDescription>
                  <img src="/logo.svg"/>
                  <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
                  <p>Sign in to the App with Google Authentication Securely</p>

                  <Button 
                    onClick={() => {login()}}
                    className='w-full mt-5 flex gap-4 items-center'>
                    <FcGoogle className="h-10 w-10"/> 
                    Sign In With Google
                  </Button>

                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  )
}

export default CreateTrip