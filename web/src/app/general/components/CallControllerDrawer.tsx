import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useAppDispatch, useAppSelector } from '@/base/appContext.tsx'

export const CallControllerDrawer = () => {
    const dispatch = useAppDispatch()
    const open = useAppSelector((s) => s.callControllerOpen)
    const videoId = 'SIBdL2EozV8'

    const onDrawerClose = () => {
        dispatch({ type: 'updateCallControllerOpen', payload: false })
    }

    return (
        <Drawer onClose={onDrawerClose} open={open}>
            <DrawerContent className={'h-full'}>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose onClick={onDrawerClose}>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
