export default function Users(props) {

    console.log(props.users.length, 'props')

    if (props.users.length === 0) {
        return (
            <h1>no users</h1>
        )
    } else {
        return (
            <ul>
                {props.users.map(item => {
                    console.log(item)
                return <li>Name: {item.user.name}</li>
            })}
            </ul>
        )
    }
  }