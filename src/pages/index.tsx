import { type NextPage } from "next";
import Head from "next/head";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs"
import { api, } from "~/utils/api";
import {RouterOutputs } from "~/utils/api"
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";


dayjs.extend(relativeTime)
 
const CreatePostWizard = () => {

  const {user} = useUser();


 
  if(!user) return null ;

  return (
    <div className="flex gap-4 w-full ">
      <Image   
      src={user.profileImageUrl} 
      alt="Profile image" 
      className="h-14 w-14 rounded-full" 
      width={56}
      height={56}
      />

     <input placeholder="Type some emojis...." className="bg-transparent grow outline-none"></input>

    </div>
  )
}


type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = ( props : PostWithUser) => {
  const {post , author}= props;    
  return (    
   <div key={post.id} className=" border-b border-slate-400 flex p-4 gap-3">
    <Image 
    src={author.profileImageUrl} 
    alt="profile image of author" 
    className="h-14 w-14 rounded-full" 
    width={56}
    height={56}
    /> 
    <div className="flex flex-col">
       <div className="flex text-slate-300 gap-4">
         <span>{`@${author.username}`}</span>
         <span className="font-thin">{` ${dayjs(post.createdAt).fromNow()}`}</span>
       </div>
      <span>{post.content}</span> 
     </div>
   </div> 
   )

}
 

const Home: NextPage = () => {



  const user = useUser()

  const {data , isLoading} = api.posts.getAll.useQuery()

  if (isLoading) return <div>Loading...</div>

  if(!data) return <div>Something went wrong</div>

  console.log(user)

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className=" w-full h-full md:max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && 
            (
             <div><SignInButton/></div>
            )}
            {user.isSignedIn && <CreatePostWizard/>}
          </div>
      
      <div className="flex flex-col">
        {[...data]?.map((fullPost) => (
        <PostView  {...fullPost} key={fullPost.post.id} />
        ) )}
      </div>
      </div>
      </main>
    </>
  );
};

export default Home;
