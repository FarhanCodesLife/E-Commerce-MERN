import postModels from "../models/post.models.js";
import userModels from "../models/user.models.js";

import fs from "fs";
import { v2 as cloudinary } from "cloudinary";


// cloudinary config
cloudinary.config({
    cloud_name: "dwuc4qz3n",
    api_key: "237728971423496",
    api_secret: "8Q6ZLV2ouehlYs67BTGq86l2R98",
  });

export const getAllPosts = async (req, res) => {
    try {
        const posts = await postModels.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModels.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// upload image function
const uploadImageToCloudinary = async (localpath) => {
    try {
      const uploadResult = await cloudinary.uploader.upload(localpath, {
        resource_type: "auto",
      });
      fs.unlinkSync(localpath);
      return uploadResult.url;
    } catch (error) {
      fs.unlinkSync(localpath);
      return null;
    }
  };
  

  export const createPost = async (req, res) => {
    const { name, description, price, category, stock, autorId } = req.body;
  
    // Validate required fields
    // if (!name || !description || !price || !autorId) {
    //   return res.status(400).json({ message: "All fields are required" });
    // }
  
    // Check if an image file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
  
    try {
      // Upload the image to Cloudinary
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      if (!uploadResult) {
        await fs.unlink(req.file.path); // Cleanup if upload fails
        return res.status(500).json({ message: "Error occurred while uploading image" });
      }
  
      // Create the post
      const post = await postModels.create({
        name,
        description,
        price,
        category,
        stock,
        images: uploadResult, // Add uploaded image URL
        autorId,
      });
  
      // Find the user and add the post reference
      const User = await userModels.findById(autorId);
      if (!User) {
        return res.status(404).json({ message: "User not found" });
      }
      User.posts.push(post);
      await User.save();
  
      // Success response
      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      console.error("Error in createPost:", error);
  
      // Cleanup local file on error
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting local file after failure:", unlinkError);
      }
  
      res.status(500).json({ message: error.message });
    }
  };
  

// // upload image
// const uploadImage = async (req, res) => {
//     if (!req.file)
//       return res.status(400).json({
//         message: "no image file uploaded",
//       });
  
//     try {
//       const uploadResult = await uploadImageToCloudinary(req.file.path);
  
//       if (!uploadResult)
//         return res
//           .status(500)
//           .json({ message: "error occured while uploading image" });
  
//       res.json({
//         message: "image uploaded successfully",
//         url: uploadResult,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "error occured while uploading image" });
//     }
//   };


export const editPost = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, images } = req.body;
    try {
        const post = await postModels.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        post.name = name;
        post.description = description;
        post.price = price;
        post.category = category;
        post.stock = stock;
        post.images = images;
        await post.save();
        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await postModels.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        await post.remove();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}