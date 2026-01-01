import NavigationBar from "@/components/NavigationBar";
import { getTags } from "@/api/tag";
import { useState, useEffect } from "react";
import { Tag } from "@/types/recipe";

function AddTag() {

    const [tags, setTags] = useState<Tag[]>([]);

    useEffect(() => {
        getTags().then((data) => setTags(data));
    }, []);

  return (
    <>
      <NavigationBar />
      <div>
        <h1 className="text-4xl font-bold p-8 text-center">Tag Page</h1>

        <div>
            <h2 className="text-center text-2xl">Currently added tags:</h2>

            <ul>
                {tags.map((tag) => (
                    <li key={tag.id} className="text-center text-lg">{tag.name}</li>
                ))}
            </ul>

        </div>


      </div>
    </>
  );
}

export default AddTag;