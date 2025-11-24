type Props = {}

export default function Home({}: Props) {
  // const { data } = useQuery({
  //   queryKey: ['ranking'],
  //   queryFn: async () => {
  //     const response = await fetch(
  //       'https://1bb0cs9g39.execute-api.us-east-2.amazonaws.com/WeatherForecast',
  //     )
  //     return response.json()
  //   },
  // })
  // return <div>{JSON.stringify(data)}</div>
  return <div className="flex h-full">Home</div>
}
