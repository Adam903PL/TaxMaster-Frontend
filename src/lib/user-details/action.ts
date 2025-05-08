export const getUserDetails = async () => {
    const resp = await fetch("/api/user-details",{
        credentials: "include",
    });
    const data = await resp.json();
    console.log(data,"asdfasdasd");
    return data;
};
