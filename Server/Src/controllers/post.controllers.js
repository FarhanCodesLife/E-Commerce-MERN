import postModels from "../models/post.models.js";
import userModels from "../models/user.models.js";

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


export const createPost = async (req, res) => {
    
    const { name, description, price, category, stock, images, autorId } = req.body;
    try {
        const post = await postModels.create({
            name,
            description,
            price,
            category,
            stock,
            images,
            autorId
        });

        const User = await userModels.findById(autorId);
        User.posts.push(post);
        await User.save();

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


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