import { Button } from './ui/button'
import { Text } from './ui/text'

interface ImageCardProps {
  image: string
  onClick: () => void
  title?: string
}
export default function ImageCard({ image, onClick, title }: ImageCardProps) {
  return (
    <Button
      onClick={onClick}
      className="group relative rounded-2xl h-fit w-full p-0 overflow-hidden hover:scale-102 hover:brightness-105 duration-250"
    >
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <Text className="absolute bottom-0 w-full p-2 bg-primary/80 text-secondary group-hover:bg-primary-dark transition-colors duration-250">
        {title}
      </Text>
    </Button>
  )
}
