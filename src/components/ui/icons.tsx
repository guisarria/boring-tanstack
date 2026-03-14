import type { ComponentProps } from "react"

export type IconProps = ComponentProps<"svg"> & {
  size?: number | string
}

const ICON_SIZE = 32

export const Icons = {
  nextJs: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g fill="none">
        <g clipPath="url(#a)">
          <path
            fill="currentColor"
            d="M11.214.006c-.052.005-.216.022-.364.033-3.408.308-6.6 2.147-8.624 4.974a11.9 11.9 0 00-2.118 5.243c-.096.66-.108.854-.108 1.748s.012 1.089.108 1.748c.652 4.507 3.86 8.293 8.209 9.696.779.251 1.6.422 2.533.526.364.04 1.936.04 2.3 0 1.611-.179 2.977-.578 4.323-1.265.207-.105.247-.134.219-.157a212 212 0 01-1.955-2.62l-1.919-2.593-2.404-3.559a343 343 0 00-2.422-3.556c-.009-.003-.018 1.578-.023 3.51-.007 3.38-.01 3.516-.052 3.596a.43.43 0 01-.206.213c-.075.038-.14.045-.495.045H7.81l-.108-.068a.44.44 0 01-.157-.172l-.05-.105.005-4.704.007-4.706.073-.092a.6.6 0 01.174-.143c.096-.047.133-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 2 2.895 4.362l4.734 7.172 1.9 2.878.097-.063a12.3 12.3 0 002.465-2.163 11.95 11.95 0 002.825-6.135c.096-.66.108-.854.108-1.748s-.012-1.088-.108-1.748C23.24 5.75 20.032 1.963 15.683.56a12.6 12.6 0 00-2.498-.523c-.226-.024-1.776-.05-1.97-.03m4.913 7.26a.47.47 0 01.237.276c.018.06.023 1.365.018 4.305l-.007 4.218-.743-1.14-.746-1.14V10.72c0-1.983.009-3.097.023-3.151a.48.48 0 01.232-.296c.097-.05.132-.054.5-.054.347 0 .408.005.486.047"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  ),
  drizzle: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="#4caf50"
        d="M5.22 23.118l3.647-6.593a1.712 1.712 0 10-2.996-1.657L2.224 21.46a1.712 1.712 0 002.996 1.658m12.02 0l3.648-6.593a1.712 1.712 0 10-2.996-1.657l-3.648 6.592a1.712 1.712 0 002.996 1.658m-3.378-5.96l3.88-6.588a1.706 1.706 0 00-2.94-1.73l-3.88 6.588a1.706 1.706 0 002.94 1.73m12.028 0l3.88-6.588a1.706 1.706 0 00-2.94-1.73l-3.88 6.588a1.706 1.706 0 002.94 1.73"
      />
    </svg>
  ),
  betterAuth: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 3.39v17.22h5.783v-5.55h6.434V8.939H5.783V3.39zm12.217 5.55h5.638v6.122h-5.638v5.548H24V3.391H12.217z"
      />
    </svg>
  ),
  tanStack: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.078.042c.316-.042.65-.014.97-.014c1.181 0 2.341.184 3.472.532a12.3 12.3 0 0 1 3.973 2.086a11.9 11.9 0 0 1 3.432 4.33c1.446 3.15 1.436 6.97-.046 10.107c-.958 2.029-2.495 3.727-4.356 4.965c-1.518 1.01-3.293 1.629-5.1 1.848c-2.298.279-4.784-.129-6.85-1.188c-3.88-1.99-6.518-5.994-6.57-10.382c-.01-.846.003-1.697.17-2.534c.273-1.365.748-2.683 1.463-3.88a12 12 0 0 1 2.966-3.36A12.3 12.3 0 0 1 9.357.3a12 12 0 0 1 1.255-.2l.133-.016zM7.064 19.99c-.535.057-1.098.154-1.557.454c.103.025.222 0 .33 0c.258 0 .52-.01.778.002c.647.028 1.32.131 1.945.303c.8.22 1.505.65 2.275.942c.813.307 1.622.402 2.484.402c.435 0 .866-.001 1.287-.12c-.22-.117-.534-.095-.778-.144a11 11 0 0 1-1.556-.416a12 12 0 0 1-1.093-.467l-.23-.108a15 15 0 0 0-1.012-.44c-.905-.343-1.908-.512-2.873-.408m.808-2.274c-1.059 0-2.13.187-3.083.667q-.346.177-.659.41c-.063.046-.175.106-.199.188s.061.151.11.204c.238-.127.464-.261.718-.357c1.64-.624 3.63-.493 5.268.078c.817.285 1.569.712 2.365 1.046c.89.374 1.798.616 2.753.74c1.127.147 2.412.028 3.442-.48c.362-.179.865-.451 1.018-.847c-.189.017-.36.098-.539.154a9 9 0 0 1-.868.222c-.994.2-2.052.24-3.053.06c-.943-.17-1.82-.513-2.693-.873l-.111-.046l-.223-.092l-.112-.046a26 26 0 0 0-1.35-.527c-.89-.31-1.842-.5-2.784-.5M9.728 1.452c-1.27.28-2.407.826-3.502 1.514c-.637.4-1.245.81-1.796 1.323c-.82.765-1.447 1.695-1.993 2.666c-.563 1-.924 2.166-1.098 3.297c-.172 1.11-.2 2.277-.004 3.388c.245 1.388.712 2.691 1.448 3.897c.248-.116.424-.38.629-.557c.414-.359.85-.691 1.317-.978a3.5 3.5 0 0 1 .539-.264c.07-.029.187-.055.22-.132c.053-.124-.045-.34-.062-.468a7 7 0 0 1-.068-1.109a9.7 9.7 0 0 1 .61-3.177c.29-.76.73-1.45 1.254-2.069c.177-.21.365-.405.56-.6c.115-.114.258-.212.33-.359c-.376 0-.751.108-1.108.218c-.769.237-1.518.588-2.155 1.084c-.291.226-.504.522-.779.76c-.084.073-.235.17-.352.116c-.176-.083-.149-.43-.169-.59c-.078-.612.154-1.387.45-1.918c.473-.852 1.348-1.58 2.376-1.555c.444.011.833.166 1.257.266c-.107-.153-.252-.264-.389-.39a5.4 5.4 0 0 0-1.107-.8c-.163-.085-.338-.136-.509-.2c-.086-.03-.195-.074-.227-.17c-.06-.177.26-.342.377-.417c.453-.289 1.01-.527 1.556-.54c.854-.021 1.688.452 2.04 1.258c.123.284.16.583.184.885l.004.057l.006.085l.002.029l.005.057l.004.056c.268-.218.457-.54.718-.774c.612-.547 1.45-.79 2.245-.544a2.97 2.97 0 0 1 1.71 1.378c.097.173.365.595.171.767c-.152.134-.344.03-.504-.026a3 3 0 0 0-.372-.094l-.068-.014l-.069-.013a3.9 3.9 0 0 0-1.377-.002c-.282.05-.557.15-.838.192v.06c.768.006 1.51.444 1.89 1.109c.157.275.235.59.295.9c.075.38.022.796-.082 1.168c-.035.125-.098.336-.247.365c-.106.02-.195-.085-.256-.155a4.6 4.6 0 0 0-.492-.522a20 20 0 0 0-1.467-1.14c-.267-.19-.56-.44-.868-.556c.087.208.171.402.2.63c.088.667-.192 1.296-.612 1.798a2.6 2.6 0 0 1-.426.427c-.067.05-.151.114-.24.1c-.277-.044-.31-.463-.353-.677c-.144-.726-.086-1.447.114-2.158c-.178.09-.307.287-.418.45a5.3 5.3 0 0 0-.612 1.138c-.61 1.617-.604 3.51.186 5.066c.088.174.221.15.395.15h.157a3 3 0 0 1 .472.018c.08.01.193 0 .257.06c.077.072.036.194.018.282c-.05.246-.066.469-.066.72c.328-.051.419-.576.535-.84c.131-.298.265-.597.387-.9c.06-.148.14-.314.119-.479c-.024-.185-.157-.381-.25-.54c-.177-.298-.378-.606-.508-.929c-.104-.258-.007-.58.286-.672c.161-.05.334.049.439.166c.22.244.363.609.523.896l1.249 2.248q.159.286.32.57c.043.074.086.188.173.219c.077.028.182-.012.26-.027c.198-.04.398-.083.598-.12c.24-.043.605-.035.778-.222c-.253-.08-.545-.075-.808-.057c-.158.01-.333.067-.479-.025c-.216-.137-.36-.455-.492-.667c-.326-.525-.633-1.057-.945-1.59l-.05-.084l-.1-.17q-.075-.126-.149-.255c-.037-.066-.092-.153-.039-.227c.056-.076.179-.08.29-.081h.021q.066.001.117-.004a10 10 0 0 1 1.347-.107c-.035-.122-.135-.26-.103-.39c.071-.292.49-.383.686-.174c.131.14.207.334.292.504c.113.223.24.44.361.66c.211.383.441.757.658 1.138l.055.094l.028.047c.093.156.187.314.238.489c-.753-.035-1.318-.909-1.646-1.499c-.027.095.016.179.05.27q.103.282.262.54c.152.244.326.495.556.673c.408.315.945.317 1.436.283c.315-.022.708-.165 1.018-.068s.434.438.25.7c-.138.196-.321.27-.55.3c.162.346.373.667.527 1.02c.064.146.13.37.283.448c.102.051.248.003.358 0c-.11-.292-.317-.54-.419-.839c.31.015.61.176.898.28c.567.202 1.128.424 1.687.648l.258.104c.23.092.462.183.689.283c.083.037.198.123.29.07c.074-.043.123-.146.169-.215a10.3 10.3 0 0 0 1.393-3.208c.75-2.989.106-6.287-1.695-8.783c-.692-.96-1.562-1.789-2.522-2.476c-2.401-1.718-5.551-2.407-8.44-1.768m4.908 14.904c-.636.166-1.292.317-1.945.401c.086.293.296.577.45.84c.059.101.122.237.24.281c.132.05.292-.03.417-.072c-.058-.158-.155-.3-.235-.45c-.033-.06-.084-.133-.056-.206c.05-.137.263-.13.381-.153c.31-.063.617-.142.928-.204c.114-.023.274-.085.389-.047c.086.03.138.1.187.174l.022.033q.043.07.097.122c.125.113.313.13.472.162c-.097-.219-.259-.41-.362-.63c-.06-.127-.11-.315-.242-.388c-.182-.102-.557.089-.743.137m-4.01-1.457c-.03.38-.147.689-.33 1.019c.21.026.423.036.629.087c.154.038.296.11.449.153c-.082-.224-.233-.423-.35-.63c-.12-.208-.226-.462-.398-.63"
      />
    </svg>
  ),
  neon: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M63 0.0177909V63.5526L38.4178 42.2501V63.5526H0V0L63 0.0177909ZM7.72251 55.8389H30.6953V25.3238L55.2779 47.0476V7.72922L7.72251 7.71559V55.8389Z"
        fill="#37C38F"
      />
    </svg>
  ),
  typeScript: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 27 26"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z"
        className="fill-blue-400"
      ></path>
    </svg>
  ),
  tailwind: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 54 33" fill="none" {...props}>
      <title>Tailwind CSS</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        fill="#06B6D4"
      />
    </svg>
  ),
  zod: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill="white"
        d="M2.584 3.582a2.25 2.25 0 012.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.25 2.25 0 01-.624 2.443l-9.61 8.52a2.25 2.25 0 01-2.963.018L.776 12.773a2.25 2.25 0 01-.64-2.467z"
      />
      <path
        className="fill-blue-400"
        d="M2.584 3.582a2.25 2.25 0 012.112-1.479h14.617c.948 0 1.794.595 2.115 1.487l2.44 6.777a2.25 2.25 0 01-.624 2.443l-9.61 8.52a2.25 2.25 0 01-2.963.018L.776 12.773a2.25 2.25 0 01-.64-2.467zm12.038 4.887l-9.11 5.537 5.74 5.007a1.206 1.206 0 001.593-.006l5.643-5.001H14.4l6.239-3.957c.488-.328.69-.947.491-1.5l-1.24-3.446a1.535 1.535 0 00-1.456-1.015H5.545a1.535 1.535 0 00-1.431 1.01l-1.228 3.37z"
      />
    </svg>
  ),
  motion: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M48.379 39.997L23.063 88.003H0L19.77 50.52c3.064-5.814 10.708-10.523 17.078-10.523zM104.937 52c0-6.631 5.162-12.002 11.531-12.002S128 45.368 128 52c0 6.629-5.162 12-11.532 12-6.369 0-11.531-5.37-11.531-12.001M52.703 39.997h23.063L50.45 88.003H27.387zm27.238 0h23.063L83.241 77.48c-3.065 5.814-10.715 10.523-17.084 10.523H54.625z" />
    </svg>
  ),
  discord: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      className="size-4"
      fill="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <title>Discord</title>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
  gitHub: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>Github</title>
      <path
        clipRule="evenodd"
        d="M8 1.46252C4.40875 1.46252 1.5 4.37029 1.5 7.96032C1.5 10.8356 3.36062 13.2642 5.94438 14.1251C6.26937 14.182 6.39125 13.987 6.39125 13.8165C6.39125 13.6621 6.38313 13.1504 6.38313 12.6063C4.75 12.9068 4.3275 12.2083 4.1975 11.8428C4.12437 11.6559 3.8075 11.0793 3.53125 10.9249C3.30375 10.8031 2.97875 10.5026 3.52312 10.4945C4.035 10.4863 4.40062 10.9656 4.5225 11.1605C5.1075 12.1433 6.04188 11.8671 6.41563 11.6966C6.4725 11.2742 6.64313 10.9899 6.83 10.8275C5.38375 10.665 3.8725 10.1046 3.8725 7.61919C3.8725 6.91255 4.12438 6.32775 4.53875 5.87291C4.47375 5.71046 4.24625 5.04444 4.60375 4.15099C4.60375 4.15099 5.14812 3.98042 6.39125 4.81701C6.91125 4.67081 7.46375 4.59771 8.01625 4.59771C8.56875 4.59771 9.12125 4.67081 9.64125 4.81701C10.8844 3.9723 11.4288 4.15099 11.4288 4.15099C11.7863 5.04444 11.5588 5.71046 11.4938 5.87291C11.9081 6.32775 12.16 6.90443 12.16 7.61919C12.16 10.1127 10.6406 10.665 9.19438 10.8275C9.43 11.0305 9.63313 11.4204 9.63313 12.0296C9.63313 12.8987 9.625 13.5972 9.625 13.8165C9.625 13.987 9.74687 14.1901 10.0719 14.1251C11.3622 13.6896 12.4835 12.8606 13.2779 11.7547C14.0722 10.6488 14.4997 9.32178 14.5 7.96032C14.5 4.37029 11.5913 1.46252 8 1.46252Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  x: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>X</title>
      <path
        clipRule="evenodd"
        d="M1.60022 2H5.80022L8.78759 6.16842L12.4002 2H14.0002L9.5118 7.17895L14.4002 14H10.2002L7.21285 9.83158L3.60022 14H2.00022L6.48864 8.82105L1.60022 2ZM10.8166 12.8L3.93657 3.2H5.18387L12.0639 12.8H10.8166Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  linkedIn: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>LinkedIn</title>
      <path
        clipRule="evenodd"
        d="M3.5 2C2.67157 2 2 2.67157 2 3.5V12.5C2 13.3284 2.67157 14 3.5 14H12.5C13.3284 14 14 13.3284 14 12.5V3.5C14 2.67157 13.3284 2 12.5 2H3.5ZM4.74556 5.5C5.21057 5.5 5.5 5.16665 5.5 4.75006C5.49133 4.3241 5.21057 4 4.75438 4C4.29824 4 4 4.3241 4 4.75006C4 5.16665 4.28937 5.5 4.73687 5.5H4.74556ZM5.5 6.5V12H4V6.5H5.5ZM7 12H8.5V8.89479C8.5 8.89479 8.60415 7.78962 9.55208 7.78962C10.5 7.78962 10.5 9.02275 10.5 9.02275V12H12V8.8133C12 7.13837 11.25 6.5025 10.125 6.5025C9 6.5025 8.5 7.27778 8.5 7.27778V6.5025H7.00005C7.02383 7.01418 7 12 7 12Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
  google: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Google</title>
      <g clipRule="evenodd" fill="none" fillRule="evenodd">
        <path
          d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
          fill="#f44336"
          opacity={0.987}
        />
        <path
          d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
          fill="#ffc107"
          opacity={0.997}
        />
        <path
          d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
          fill="#448aff"
          opacity={0.999}
        />
        <path
          d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
          fill="#43a047"
          opacity={0.993}
        />
      </g>
    </svg>
  ),
  shadcn: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <line
        x1="208"
        y1="128"
        x2="128"
        y2="208"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
      <line
        x1="192"
        y1="40"
        x2="40"
        y2="192"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
      />
    </svg>
  ),
  baseui: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 17 24"
      fill="currentcolor"
      aria-label="Base UI"
      {...props}
    >
      <path d="M9.5001 7.01537C9.2245 6.99837 9 7.22385 9 7.49999V23C13.4183 23 17 19.4183 17 15C17 10.7497 13.6854 7.27351 9.5001 7.01537Z"></path>
      <path d="M8 9.8V12V23C3.58172 23 0 19.0601 0 14.2V12V1C4.41828 1 8 4.93989 8 9.8Z"></path>
    </svg>
  ),
  viteplus: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 36 20"
      {...props}
    >
      <path
        fill="#6254fe"
        d="M17.85 19.535a.483.483 0 0 1-.864-.298v-4.403a.967.967 0 0 0-.967-.967h-4.862a.483.483 0 0 1-.393-.764l3.197-4.475a.967.967 0 0 0-.788-1.53H7.29a.483.483 0 0 1-.393-.764L11.04.533a.48.48 0 0 1 .394-.203h12.348c.393 0 .622.445.393.764L20.978 5.57c-.457.64 0 1.53.788 1.53h4.861c.404 0 .63.464.38.782L17.85 19.536"
      />
      <mask
        id="a"
        x="6"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path
          fill="#833bff"
          d="M17.85 19.535a.483.483 0 0 1-.864-.298v-4.403a.967.967 0 0 0-.967-.967h-4.862a.483.483 0 0 1-.393-.764l3.197-4.475a.967.967 0 0 0-.788-1.53H7.29a.483.483 0 0 1-.393-.764L11.04.533a.48.48 0 0 1 .394-.203h12.348c.393 0 .622.445.393.764L20.978 5.57c-.457.64 0 1.53.788 1.53h4.861c.404 0 .63.464.38.782L17.85 19.536"
        />
      </mask>
      <g mask="url(#a)">
        <g filter="url(#b)">
          <ellipse
            cx="2.354"
            cy="6.284"
            fill="#ede6ff"
            rx="2.354"
            ry="6.284"
            transform="rotate(89.814 -4.496 9.333)scale(1 -1)"
          />
        </g>
        <g filter="url(#c)">
          <ellipse
            cx="4.444"
            cy="12.758"
            fill="#ede6ff"
            rx="4.444"
            ry="12.758"
            transform="rotate(89.814 -6.879 -3.19)scale(1 -1)"
          />
        </g>
        <g filter="url(#d)">
          <ellipse
            cx="2.354"
            cy="13.029"
            fill="#4e14ff"
            rx="2.354"
            ry="13.029"
            transform="rotate(89.814 -7.86 -2.7)scale(1 -1)"
          />
        </g>
        <g filter="url(#e)">
          <ellipse
            cx="2.354"
            cy="13.077"
            fill="#4e14ff"
            rx="2.354"
            ry="13.077"
            transform="matrix(.00324 1 1 -.00324 -8.57 12.86)"
          />
        </g>
        <g filter="url(#f)">
          <ellipse
            cx="2.354"
            cy="13.077"
            fill="#4e14ff"
            rx="2.354"
            ry="13.077"
            transform="rotate(269.814 2.697 10.62)scale(-1 1)"
          />
        </g>
        <g filter="url(#g)">
          <ellipse
            cx="6.014"
            cy="9.436"
            fill="#ede6ff"
            rx="6.014"
            ry="9.436"
            transform="rotate(93.35 13.698 24.078)scale(-1 1)"
          />
        </g>
        <g filter="url(#h)">
          <ellipse
            cx="1.483"
            cy="9.189"
            fill="#4e14ff"
            rx="1.483"
            ry="9.189"
            transform="rotate(89.009 15.481 23.943)scale(-1 1)"
          />
        </g>
        <g filter="url(#i)">
          <ellipse
            cx="1.483"
            cy="9.189"
            fill="#4e14ff"
            rx="1.483"
            ry="9.189"
            transform="rotate(89.009 15.481 23.943)scale(-1 1)"
          />
        </g>
        <g filter="url(#j)">
          <ellipse
            cx="6.926"
            cy="4.164"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(39.51 6.926 4.164)"
          />
        </g>
        <g filter="url(#k)">
          <ellipse
            cx="27.071"
            cy="-2.273"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 27.07 -2.273)"
          />
        </g>
        <g filter="url(#l)">
          <ellipse
            cx="24.229"
            cy="4.526"
            fill="#2bfdd2"
            rx="3.539"
            ry="5.339"
            transform="rotate(37.892 24.23 4.526)"
          />
        </g>
        <g filter="url(#m)">
          <ellipse
            cx="5.958"
            cy="16.712"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 5.958 16.712)"
          />
        </g>
        <g filter="url(#n)">
          <ellipse
            cx="5.958"
            cy="16.712"
            fill="#4e14ff"
            rx="1.883"
            ry="12.44"
            transform="rotate(37.892 5.958 16.712)"
          />
        </g>
        <g filter="url(#o)">
          <ellipse
            cx="21.904"
            cy="13.039"
            fill="#4e14ff"
            rx="2.001"
            ry="12.44"
            transform="rotate(37.892 21.904 13.039)"
          />
        </g>
        <g filter="url(#p)">
          <ellipse
            cx="23.816"
            cy="14.434"
            fill="#2bfdd2"
            rx="3.437"
            ry="9.003"
            transform="rotate(37.892 23.816 14.434)"
          />
        </g>
      </g>
      <path
        className="fill-[#08060d] dark:fill-white"
        fill="#08060d"
        d="M3.644 0c-3.932 5.628-3.955 14.351 0 20H6.3C2.346 14.35 2.37 5.627 6.3 0zM30.625 10h2.657c-.001-3.593-.99-7.184-2.957-10h-2.656c1.966 2.816 2.955 6.407 2.957 10zM35.314 14.907h-2.665a19 19 0 0 0 .453-2.251h-2.657a19 19 0 0 1-.453 2.251h-2.669a17 17 0 0 1-.944 2.658h2.669A15 15 0 0 1 27.668 20h2.656a15 15 0 0 0 1.38-2.435h2.665c.386-.851.7-1.742.944-2.658"
      />
      <defs>
        <filter
          id="b"
          x="-1.688"
          y="7.232"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="c"
          x="-16.579"
          y="-2.889"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="d"
          x="-14.454"
          y="1.198"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="e"
          x="-12.49"
          y="8.89"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="f"
          x="-11.835"
          y="9.381"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="g"
          x="13.495"
          y="-7.32"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="3.273"
          />
        </filter>
        <filter
          id="h"
          x="16.825"
          y="1.306"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="i"
          x="16.825"
          y="1.306"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="j"
          x="-5.05"
          y="-9.437"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="k"
          x="15.358"
          y="-16.087"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="l"
          x="15.994"
          y="-4.143"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="m"
          x="-5.755"
          y="2.898"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="n"
          x="-5.755"
          y="2.898"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="o"
          x="10.173"
          y="-.784"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
        <filter
          id="p"
          x="13.728"
          y="3.092"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur
            result="effect1_foregroundBlur_318_26118"
            stdDeviation="1.964"
          />
        </filter>
      </defs>
    </svg>
  ),
  oxlint: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grad">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#67e8f9" />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad)"
        d="m29.795 23.354l-4.78-4.95a.645.645 0 0 0-.956 0a14.4 14.4 0 0 1-2.352 1.697A1.197 1.197 0 0 1 20 18.899v-2.333a1.42 1.42 0 0 1 .41-.99l6.585-6.37A.714.714 0 0 0 26.517 8H21.5A1.5 1.5 0 0 1 20 6.5V2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V6.5A1.5 1.5 0 0 1 10.5 8H5.483a.714.714 0 0 0-.478 1.206l6.585 6.37a1.42 1.42 0 0 1 .41.99v2.333a1.197 1.197 0 0 1-1.707 1.202a14.4 14.4 0 0 1-2.352-1.697a.645.645 0 0 0-.956 0l-4.78 4.95a.7.7 0 0 0 0 .99a19.65 19.65 0 0 0 27.59 0a.7.7 0 0 0 0-.99"
      />
    </svg>
  ),
  oxfmt: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="grad2">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fdba74" />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad2)"
        d="m29.795 23.354l-4.78-4.95a.645.645 0 0 0-.956 0a14.4 14.4 0 0 1-2.352 1.697A1.197 1.197 0 0 1 20 18.899v-2.333a1.42 1.42 0 0 1 .41-.99l6.585-6.37A.714.714 0 0 0 26.517 8H21.5A1.5 1.5 0 0 1 20 6.5V2.75a.75.75 0 0 0-.75-.75h-6.5a.75.75 0 0 0-.75.75V6.5A1.5 1.5 0 0 1 10.5 8H5.483a.714.714 0 0 0-.478 1.206l6.585 6.37a1.42 1.42 0 0 1 .41.99v2.333a1.197 1.197 0 0 1-1.707 1.202a14.4 14.4 0 0 1-2.352-1.697a.645.645 0 0 0-.956 0l-4.78 4.95a.7.7 0 0 0 0 .99a19.65 19.65 0 0 0 27.59 0a.7.7 0 0 0 0-.99"
      />
    </svg>
  ),
  nitro: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      {...props}
    >
      <g clipPath="url(#clip0_115_108)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M35.2166 7.02016C28.0478 -1.38317 15.4241 -2.38397 7.02077 4.78481C-1.38256 11.9536 -2.38336 24.5773 4.78542 32.9806C11.9542 41.3839 24.5779 42.3847 32.9812 35.216C41.3846 28.0472 42.3854 15.4235 35.2166 7.02016ZM25.2525 17.5175C26.0233 17.5175 26.5155 18.3527 26.1287 19.0194L26.0175 19.2111L18.4696 31.6294C18.3293 31.8602 18.0788 32.001 17.8088 32.001H17.0883C16.5946 32.001 16.2336 31.5349 16.3573 31.0569L18.4054 23.1384C18.5691 22.5053 18.0912 21.888 17.4373 21.888H14.2914C13.6375 21.888 13.1596 21.2708 13.3232 20.6377L16.4137 8.68289C16.5261 8.28056 16.8904 7.99734 17.3081 8.00208C17.3587 8.00266 17.4046 8.0035 17.4427 8.0047L20.6109 8.00465C21.217 8.00436 21.684 8.53896 21.6023 9.13949L21.5828 9.28246L20.3746 16.349C20.2702 16.9598 20.7406 17.5175 21.3603 17.5175H25.2525Z"
          fill="url(#paint0_diamond_115_108)"
        />
        <mask
          id="mask0_115_108"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="40"
          height="41"
        >
          <circle
            cx="20"
            cy="20.001"
            r="20"
            fill="url(#paint1_diamond_115_108)"
          />
        </mask>
        <g mask="url(#mask0_115_108)">
          <g filter="url(#filter0_f_115_108)">
            <path
              d="M1.11145 13.4267C0.0703174 16.4179 -0.245523 19.6136 0.189923 22.7507C0.62537 25.8879 1.79965 28.8768 3.61611 31.4713C5.43256 34.0659 7.83925 36.192 10.6381 37.6746C13.4369 39.1572 16.5478 39.9538 19.7147 39.999C22.8816 40.0442 26.0139 39.3366 28.8539 37.9345C31.6939 36.5324 34.1602 34.4758 36.05 31.9341C37.9397 29.3924 39.1988 26.4383 39.7236 23.3148C40.2483 20.1914 40.0238 16.9879 39.0684 13.9682L33.2532 15.808C33.9172 17.9068 34.0732 20.1333 33.7085 22.3042C33.3438 24.4751 32.4687 26.5283 31.1552 28.2949C29.8418 30.0615 28.1276 31.4908 26.1537 32.4653C24.1799 33.4399 22.0028 33.9316 19.8017 33.9002C17.6006 33.8688 15.4384 33.3151 13.4932 32.2847C11.5479 31.2543 9.87518 29.7766 8.61269 27.9733C7.35019 26.1699 6.53403 24.0926 6.23138 21.9122C5.92873 19.7317 6.14825 17.5106 6.87187 15.4316L1.11145 13.4267Z"
              fill="white"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_115_108"
          x="-10"
          y="3.42667"
          width="60"
          height="46.5744"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5"
            result="effect1_foregroundBlur_115_108"
          />
        </filter>
        <radialGradient
          id="paint0_diamond_115_108"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(4.00069 20.0004) scale(39.0007 397.71)"
        >
          <stop stopColor="#31B2F3" />
          <stop offset="0.473958" stopColor="#F27CEC" />
          <stop offset="1" stopColor="#FD6641" />
        </radialGradient>
        <radialGradient
          id="paint1_diamond_115_108"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(4 20.0011) scale(39 397.703)"
        >
          <stop stopColor="#F27CEC" />
          <stop offset="0.484375" stopColor="#31B2F3" />
          <stop offset="1" stopColor="#7D7573" />
        </radialGradient>
        <clipPath id="clip0_115_108">
          <rect width="146" height="40.001" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  resend: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1800 1800"
      fill="none"
      {...props}
    >
      <path
        d="M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z"
        className="fill-foreground"
      />
    </svg>
  ),
  voidZeroIcon: ({ size = ICON_SIZE, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 400 400"
      {...props}
    >
      <path className="fill-background" d="M0 0h400v400H0z" />
      <path
        className="fill-foreground"
        d="M101.187 109c-35.84 51.313-36.05 130.852 0 182.351H76.965c-36.059-51.499-35.849-131.038 0-182.351zm222.054 0c35.841 51.313 36.05 130.852 0 182.351h-24.22c36.058-51.499 35.848-131.038 0-182.351zm-123.136.252c50.222 0 90.924 40.711 90.924 90.926 0 50.214-40.71 90.925-90.924 90.926-50.215 0-90.926-40.712-90.926-90.926 0-50.215 40.711-90.926 90.926-90.926m55.385 52.733c-1.343-3.013-5.381-3.576-7.464-1.015l-78.65 96.458c-1.881 2.317-.974 5.785 1.797 6.893 8.144 3.258 17.782 4.869 28.932 4.869 41.264 0 62.135-22.164 62.135-69.012 0-15.39-2.258-28.084-6.75-38.193m-55.385-30.568c-41.5 0-62.137 22.165-62.137 68.761 0 15.448 2.25 28.21 6.75 38.377 1.335 3.022 5.382 3.585 7.464 1.024l78.508-96.467c1.889-2.317.974-5.792-1.805-6.892-8.119-3.216-17.715-4.803-28.78-4.803"
      />
    </svg>
  ),
  voidZeroLogo: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="283"
      height="47"
      shapeRendering="geometricPrecision"
      fill="none"
      viewBox="0 0 283 47"
    >
      <path
        className="fill-foreground"
        d="M85.24 0c19.065 0 29.081 8.014 29.081 23.395s-10.017 23.393-29.08 23.393c-19.065 0-29.017-8.013-29.017-23.393S66.176 0 85.24 0m133.166 0c-9.196 13.166-9.25 33.575 0 46.788h-6.215c-9.252-13.213-9.198-33.622 0-46.788zm56.976 0c9.195 13.166 9.249 33.575 0 46.788h-6.215c9.252-13.213 9.198-33.622 0-46.788zm-31.596.064c12.886 0 23.33 10.446 23.33 23.33 0 12.885-10.446 23.33-23.33 23.33s-23.33-10.445-23.33-23.33S230.902.065 243.786.065M28.5 33.347 40.262.775h16.091L38.518 46.013h-20.68L0 .775h16.544zm107.277 12.666h-15.509V.775h15.509zM172.075.775c15.704 0 24.688 7.11 24.688 22.62s-9.049 22.618-24.752 22.618h-28.37V.775zm85.923 12.82a1.134 1.134 0 0 0-1.915-.261l-20.181 24.75a1.134 1.134 0 0 0 .461 1.768q3.134 1.252 7.423 1.25c10.588 0 15.943-5.687 15.943-17.707 0-3.949-.579-7.207-1.731-9.8M85.24 11.115c-8.982 0-13.183 3.878-13.183 12.28 0 8.4 4.2 12.213 13.183 12.213s13.184-3.748 13.184-12.213-4.2-12.28-13.184-12.28m73.91 23.912h10.728c7.367 0 10.986-3.167 10.986-11.632s-3.619-11.633-10.986-11.633H159.15zm84.636-29.275c-10.648 0-15.943 5.687-15.943 17.643 0 3.963.578 7.238 1.732 9.846.343.776 1.381.92 1.915.263l20.145-24.751a1.134 1.134 0 0 0-.464-1.77c-2.083-.825-4.546-1.231-7.385-1.231"
      />
    </svg>
  ),
}
